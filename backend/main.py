from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/resume")
def get_resume():
    return {
        "name": "Connor Haley",
        "title": "Computer Engineer",
        "phone": "904-439-1994",
        "summary": (
            "Passionate about embedded software, real-time hardware integration, "
            "and control systems, complemented by experience in full-stack and "
            "interactive web design. Dedicated to leading teams through complex challenges."
        ),
        "experience": [
            {
                "role": "Embedded Systems & Software Lead",
                "company": "Drone Home Design Team — University of Florida",
                "location": "Gainesville, FL",
                "dates": "Aug 2024 – May 2025",
                "bullets": [
                    "Developed vehicle that autonomously locates, retrieves, and recharges field drones to minimize mission downtime.",
                    "Engineered Flask UI to interface with remote R/C vehicle over LTE using ROS2 on NVIDIA Nano Jetson Super.",
                    "Created embedded control system integrating sensors, microcontrollers, and comms for real-time vehicle operation.",
                    "Implemented modular control software supporting feedback loops, sensor fusion, and autonomous fault recovery.",
                ],
            },
            {
                "role": "Engineering Team Lead",
                "company": "Theme Park Engineering & Design (TPED) — University of Florida",
                "location": "Gainesville, FL",
                "dates": "Aug 2020 – May 2023",
                "bullets": [
                    "Led multidisciplinary team creating attraction prototypes integrating mechanical, electrical, and software subsystems.",
                    "Designed 3D-printable roller coaster in SolidWorks and engineered prototype animatronic eyes with Raspberry Pi.",
                    "Oversaw research, schematics, & design to ensure reliable and safe show system operation within ASTM standards.",
                ],
            },
        ],
        "additional_experience": [
            {
                "role": "Audio Engineering & Technical Lead",
                "company": "Cultural Competitive Dance Teams — University of Florida",
                "location": "Gainesville, FL",
                "dates": "Aug 2021 – Present",
                "bullets": [
                    "Co-founded & led two competitive dance teams to compete nationally, while engineering mix, set, prop, & effects.",
                    "Integrated creative workflows with technical design, applying signal-processing and systems-integration principles.",
                    "Engineered show mixes for 100s of dancers, using Logic Pro X and a rigorous feedback process with team captains.",
                ],
            },
        ],
        "education": [
            {
                "degree": "Bachelor of Science in Computer Engineering",
                "details": "Sociology Minor, Engineering Innovation Certificate",
                "school": "University of Florida",
                "location": "Gainesville, FL",
                "year": "Aug 2020 – Dec 2025",
            }
        ],
        "projects": [
            {
                "slug": "drone-home",
                "name": "Drone Home",
                "tech": "ROS2, NVIDIA Jetson, Flask, LTE, Embedded C/C++",
                "dates": "Aug 2024 – May 2025",
                "bullets": [
                    "Coming soon — full write-up of the Drone Home autonomous drone-retrieval and recharging vehicle.",
                ],
            },
            {
                "slug": "startos",
                "name": "StaRTOS",
                "tech": "TM4C123, FreeRTOS, DSP, Audio Processing",
                "dates": "2025",
                "bullets": [
                    "Coming soon — overview of StaRTOS, a real-time RTOS-driven light show app on a TM4C123.",
                ],
            },
            {
                "slug": "obdii-light-product",
                "name": "OBDII Light Product",
                "tech": "OBD-II, CAN bus, Microcontroller, Addressable LEDs",
                "dates": "TBD",
                "bullets": [
                    "Coming soon — RPM-reactive in-car lighting driven by live OBD-II telemetry over CAN.",
                ],
            },
            {
                "slug": "embedded-labs",
                "name": "Embedded Labs",
                "tech": "TM4C123, RTOS, UART, I2C, SPI, DSP",
                "dates": "Aug 2025 – Dec 2025",
                "bullets": [
                    "Configured UART, I2C, and SPI interfaces on a TM4C123 μC to communicate with sensors & LCD displays.",
                    "Developed multi-threaded RTOS apps with priority scheduling, IPC, dynamic threading, & blocking semaphores.",
                    "Configured Tiva DSP, Beaglebone connection, audio output, and personal real-time light show app, StaRTOS.",
                ],
            },
        ],
        "skills": {
            "Programming Languages": "C, C++, Python, Java, Assembly (ARM), Verilog, VHDL, MATLAB, SQL (PostgreSQL)",
            "Hardware & Embedded Systems": "Raspberry Pi, NVIDIA Jetson Nano, FPGA Design, μCs, μPs, UART, I²C, SPI",
            "Engineering Tools & Design": "ROS2, FastAPI, Socket.io, Atmel Studio, LTSpice, Quartus Prime, SolidWorks, KiCad",
            "Development & Integration": "Git, Visual Studio, Full Stack Web Development, Docker, WebSockets, API Integration",
        },
        "coursework": [
            "Microprocessors II (RTOS)",
            "Microprocessors I",
            "Digital Design & FPGA Implementation",
            "Digital Logic",
            "Computer Engineering Design I & II",
            "Data Structures & Algorithms",
            "Computer Organization",
            "Engineering Leadership",
            "Operating Systems",
            "Intro to DSP",
            "Intro to Software Engineering",
        ],
        "contact": {
            "email": "connorhaleycontact@gmail.com",
            "phone": "904-439-1994",
            "github": "https://github.com/connor-r-haley",
            "linkedin": "https://linkedin.com/in/connorrhaley",
        },
    }


@app.post("/api/contact")
def contact(message: dict):
    print(f"Contact form: {message}")
    return {"status": "received"}
