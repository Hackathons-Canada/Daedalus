import { BackButton } from "@/components/ui/back-button";
import PageWrapper from "@/components/PageWrapper";

export default function QrScannerPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="space-y-2">
          <div className="w-fit bg-gradient-to-r from-primary via-sky-400 to-primary bg-clip-text text-transparent">
            <h1 className="font-rubik text-3xl font-bold">QR Code Scanner</h1>
          </div>
          <p className="text-textMuted max-md:text-sm">
            Point the camera at a participant&apos;s QR code to check them in.
          </p>
        </div>

        {/* <Scanner /> */}
      </div>
      <BackButton />
    </PageWrapper>
  );
}
