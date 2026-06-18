# gui-dlp

## Description
**gui-dlp** is a desktop application for downloading media. Built with Nextron (Next.js + Electron), it abstracts the complex command-line arguments of `yt-dlp` into an intuitive, queue-based graphical interface.

## Features
* **Queue Management:** Add, remove, and manage multiple download tasks simultaneously.
* **Batch Downloading:** Start all pending downloads with a single click while automatically preventing duplicate or running tasks from restarting.
* **Format Selection:** Toggle between Video+Audio, Video Only, and Audio Only modes, with dynamic file extension options based on the selected mode.
* **Real-time Progress Tracking:** Visual progress bars and ETA indicators for active downloads.

## Tech Stack
* **Framework:** [Nextron](https://github.com/saltyshiomix/nextron) (Next.js + Electron)
* **Frontend:** React, Next.js, TypeScript
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui (Radix UI primitives)
* **Icons:** Lucide React
* **Underlying Engine:** `yt-dlp` and Node.js `child_process`

---

## Instructions

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), or [yarn](https://yarnpkg.com/)
* **Media Engines:** [yt-dlp](https://github.com/yt-dlp/yt-dlp) and [FFmpeg](https://ffmpeg.org/) must be installed and accessible in your system's PATH.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ketsupL/gui-dlp.git
   cd gui-dlp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

### Running the Application

**Development Mode:**
To start the Electron application with frontend hot-reloading:
```bash
npm run dev
```

### Building for Production

To package the application into a standalone executable for your current operating system:
```bash
npm run build
```
Once the build process completes, the distributable files (e.g., `.exe` for Windows, `.dmg` for macOS, `.AppImage` for Linux) will be located in the `dist/` directory.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.