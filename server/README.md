# Blood Donation Server

## Admin setup

The admin panel is protected by the server. To grant admin access to the existing account, add this line to `server/.env`:

```env
ADMIN_EMAILS=uk699044@gmail.com
```

If `ADMIN_EMAILS` already exists, add this address as a comma-separated entry instead of replacing the other admins. Restart the server and log in again with that account. The server promotes the matching registered account to the `admin` role at login. Do not expose admin-only API routes based on client-side checks alone; the API verifies the account role.

The `.env.example` file is a reference for required settings. Do not replace an existing `.env` with the example, since that would overwrite its database connection or JWT secret.

## Features

- Signed-in users can track their own blood requests and view status history.
- Admins can update request statuses and create, edit, or delete blood-bank listings.
- Blood-bank listings can be searched by city and reviewed by signed-in users.
- Per-unit rates are manually entered indicative INR prices. They are not live quotes; users should contact the bank to confirm rates and availability.
