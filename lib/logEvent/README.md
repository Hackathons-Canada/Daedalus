## How to use

## Server-Side Example: Log in a Server Component

```tsx
import { logEventServer } from "@/lib/logEvent/server";

export default async function Page() {
  // Log a page view event
  await logEventServer({
    userId: 123, // Replace with actual user ID or null for anonymous
    actionType: "PAGE_VIEW",
    actionDetails: { page: "Home" },
  });

  return <div>Home Page</div>;
}
```

## Client-Side Example: Log in a Client Component

```tsx
"use client";

import { logEventClient } from "@/lib/logEvent/client";

export default function MyComponent() {
  const handleClick = async () => {
    await logEventClient({
      userId: 123, // Replace with actual user ID or null for anonymous
      actionType: "search",
      actionDetails: { query: "William Zeng" },
    });
  };

  return <button onClick={handleClick}>Search</button>;
}
```

# todo:

- Rewrite to get userid from session instead of passed
