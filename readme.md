![prics-epod](https://github.com/user-attachments/assets/86fcba4a-cc82-445e-ada6-a3d8bc215235)

# Electronic Proof of Delivery (ePOD)

Electronic Proof of Delivery (ePOD) is built with React.js, Tailwind CSS, and ShadCN. This system helps streamline the delivery process and allows users to easily set up appointments.

# Features

- Monitor delivery movements, download reports, generate barcodes, and view uploaded images from drivers.
- Easily schedule truck appointments.
- Create accounts for guard roles.
- Create activities (e.g., inbound, outbound).
- View lists of trucks, drivers, users, and activities.
- Sort deliveries to the nearest drop-off location using geocoding.
- Scan barcodes and upload images as proof of delivery.
- View scheduled appointments.
- Scan gate passes for drivers.

## Third Party API

[TimezoneDB](https://timezonedb.com) - Used to prevent users from manipulating the system time

[Opencage](https://opencagedata.com) - Used to convert warehouse and customer addresses into geocodes for the nearest drop-off feature.

## Technology Stack

**Client:** React JS, Tailwind CSS, Shadcn UI

**Server:** Express JS

**Database:** MS SQL Server

## Installation

Install prics-epod-appt using npm. Make sure you have Node.js, npm, and Git installed on your local machine.

If you don't have Node.js, npm, or Git installed, you can visit the following websites to download them or simply search for installation tutorials on YouTube.

Node.js: https://nodejs.org/en

Git: https://git-scm.com/downloads

note: When you download Node.js, npm will be installed automatically.

After installing all the required dependencies, you can proceed with the procedure below.

```bash
  git clone 'https://github.com/sIUzyy/prics-backend-iis.git'
  cd prics-backend-iis
  npm install
  npm run dev
```
