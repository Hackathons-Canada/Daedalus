"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { type ApiResponse } from "@/types/api";
import { ProfileFormData, profileSchema } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HobbiesSelect } from "@/components/ui/hobbies-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { ProfileIntegrations } from "./ProfileIntegrations";

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: initialData?.bio || "",
      hobbies: initialData?.hobbies || "",
      integrations: initialData?.integrations || [],
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        bio: initialData.bio || "",
        hobbies: initialData.hobbies || "",
        integrations: initialData.integrations || [],
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: ProfileFormData) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = (await res.json()) as ApiResponse;

        if (!result.success) {
          if (res.status === 422 && result.error) {
            // Handle validation errors from server
            form.setError("root", { message: result.error });
            return;
          }

          // If rate limited, disable form temporarily
          if (res.status === 429) {
            form.reset(form.getValues());
            setTimeout(() => form.clearErrors(), 60000); // 1 minute
            return;
          }

          throw new Error(result.error || "Failed to update profile");
        }

        toast.success(result.message);
        router.refresh();
        router.replace(`/profile/${session?.user.id}`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem>
          <FormLabel>Display name (unchangeable)</FormLabel>
          <Input value={session?.user?.name?.split(" ")[0] || ""} disabled />
        </FormItem>

        {/* Bio Section */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell others about yourself..."
                  className="min-h-[120px] resize-y"
                  {...field}
                  value={field.value || ""}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                A brief introduction about yourself. Max 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hobbies Section */}
        <FormField
          control={form.control}
          name="hobbies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hobbies & Interests</FormLabel>
              <FormControl>
                <HobbiesSelect
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Select up to 5 hobbies/interests, or type your own.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Social Integrations Section */}
        <ProfileIntegrations
          control={form.control}
          fieldArray={useFieldArray({
            control: form.control,
            name: "integrations",
          })}
          isPending={isPending}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
