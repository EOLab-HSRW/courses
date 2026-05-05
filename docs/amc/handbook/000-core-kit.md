---
slug: /amc/core-kit
---

import img_esp32 from './core-kit/esp32.jpg';
import img_breadboard from './core-kit/breadboard.jpg'
import img_button from './core-kit/button.jpg'
import img_cap_ceramic from './core-kit/cap-ceramic.jpg'
import img_cap from './core-kit/cap.jpg'
import img_jumpers from './core-kit/jumpers.jpg'
import img_leds from './core-kit/leds.jpg'
import img_photoresistor from './core-kit/photoresistor-cds.jpg'
import img_pot from './core-kit/pot.jpg'
import img_resitor_ntc from './core-kit/resistor-ntc.jpg'
import img_usb_cable from './core-kit/usb-cable.jpg'

# Core Kit

*The expected reading time of this page is approximately 5 minutes*.

The "AMC Core Kit" is a minimalist kit that includes a set of components designed to help you explore the fundamentals of working with microcontrollers.

![AMC Core Kit - Banner showing 50 kits](./core-kit/banner.jpg)

The AMC Core Kit is intended to provide students with the fundamentals of working with microcontrollers, rather than serving as a fully fledged, all-in-one kit such as the [ELEGOO UNO R3 Project The Most Complete Starter Kit](https://www.elegoo.com/blogs/arduino-projects/elegoo-uno-r3-project-the-most-complete-starter-kit-tutorial). From a pedagogical perspective, the kit (AMC Core Kit) is designed to offer enough flexibility to explore multiple technologies and sensors while remaining focused and manageable.

Based on our experience from previous terms, larger kits tend to be significantly underused by students. The large number of components can be overwhelming for many of them, and it also makes it difficult to track materials, as missing components can easily become an issue.

Additionally, from both a logistical and cost perspective, it would be difficult to provide individual kits based on the ELEGOO UNO R3 model for the number of students we receive each term. For example, in SS2026, we expect approximately 50 students. In contrast, due to its simplicity and low cost, the AMC Core Kit can be easily scaled to 50 or more individual kits.

## Capabilities

The capabilities of the AMC Core Kit are aligned with the topics covered during the term. The kit is intentionally focused on fundamental concepts, while still providing enough flexibility to explore different types of inputs, outputs, sensors, and communication technologies.

Some of the terminology and acronyms introduced here, such as PWM, ADC, and others, may seem unfamiliar at this stage. These concepts will be explained in detail throughout this handbook. The list below is mainly intended to provide an overview of what can be explored with the AMC Core Kit. Where possible, these terms can be linked to the corresponding handbook sections.

**Digital input** The kit supports the exploration of basic digital input using the included *button*. This allows you to work with simple ON/OFF states and understand how microcontrollers detect changes in an external circuit. Topics that can be covered with a *button* are, pull-up and pull-down resistors, debouncing, event-based interaction (Interrupt Service Routine - ISR)

**Digital output**: The included LEDs allows you to explore digital output in its simplest form: switching components ON and OFF. In addition, the ESP32 can generate Pulse Width Modulation (PWM) signals, which makes it possible to control the apparent brightness of LEDs.
- Current-limiting resistors
- Basic GPIO control
- Pulse Width Modulation
- LED brightness control

**Analog input**: The AMC Core Kit includes a potentiometer, an NTC thermistor, and a photoresistor. These components allows you to explore analog input and understand how changing physical conditions can be converted into measurable electrical signals.
- Reading analog values
- Analog-to-Digital Conversion (ADC)
- Voltage dividers

**Wireless technologies**: The ESP32 is a suitable platform for introducing wireless communication. It supports both WiFi and Bluetooth, allowing you to explore basic connected systems without requiring additional communication modules.
- WiFi connectivity
- Bluetooth communication
- Basic Internet of Things applications
- Sending and receiving data wirelessly
- Network-based interaction (more advanced)

## Limitations

As mentioned at the beginning of this page, the AMC Core Kit is not intended to be an all-in-one solution. Therefore, the kit has some known limitations. However, each of these limitations is addressed through the teaching structure described below.

**How are missing technologies handled?**

To explore additional technologies that are relevant to AMC, the AMC teaching team will provide the required sensors, modules, and additional equipment during the corresponding exercise sessions. These components will be made available for the duration of the exercises and collected again at the end of the session.

As an AMC student, you may also have the opportunity to repeat specific exercises if you consider it useful for your learning process. However, this must be done on-site at the university, using the equipment provided by the teaching team. Please contact the teaching team sufficiently in advance to arrange an appointment.

**What technologies are missing from the kit?**

Inter-Integrated Circuit (**I2C**): pronounced as "eye-squared-see" or "eye-two-see", is not explicitly covered by the core kit components. This communication protocol is commonly used by sensor modules such as the **BME280** temperature, humidity, and pressure sensor, the **MPU-6050** accelerometer and gyroscope, the **BH1750** light sensor, and small **SSD1306** OLED displays.

Serial Peripheral Interface (**SPI**): SPI is another common communication protocol that is not represented by a dedicated component in the AMC Core Kit. SPI is typically used when higher data transfer speeds are required. Examples include microSD card modules, RFID/NFC readers such as the **MFRC522**, TFT display modules, and thermocouple amplifier modules such as the **MAX6675**.

**1-Wire**: It is commonly used for low-cost digital temperature sensors, especially the **DS18B20** temperature sensor, which is widely used.

**Power supplies, battery module or photovoltaic system**: The kit does not include a dedicated external power supply, battery module, or photovoltaic system. For the exercises, the USB cable and the integrated voltage regulation of the ESP32 development board are sufficient (max. current draw per GPIO 40 mA at 3.3V). However, the available current depends on the specific board and USB power source. This is usually enough for the ESP32 and small low-power modules, but it is not suitable for motors, servos, relays, or other power-hungry devices. These components require an external power supply with a common ground connection to the ESP32.

**NFC, LoRa, and other wireless technologies**: The ESP32 already provides Wi-Fi and Bluetooth/BLE functionality, but other wireless technologies are not included in kit. Examples of some modules in this category include PN532 NFC modules, SX1276/RA-02 LoRa modules, nRF24L01 radio modules, and HC-05 Bluetooth modules.

**Project-dependent sensors**: Some sensors are only required for specific projects and are therefore not included in the AMC Core Kit. Examples include HC-SR04 ultrasonic distance sensors, PIR motion sensors, MQ-series gas sensors, soil moisture sensors, load cells with HX711 amplifiers, and INA219 current sensors. These components will be provided by the teaching team when they are required for a specific exercise or specific final project.

Once again, the fact that these technologies are not included in the AMC Core Kit does not mean that they will not be covered during the development of AMC. In fact, most of them, with the exception of some wireless technologies, will be addressed during the course. The difference is that these components will be provided by the teaching team only when they are required for a specific exercise, instead of being included permanently in the AMC Core Kit.

## Bill Of Material (BOM)

The following is the list of components included in the AMC Core Kit:

| Quantity | Component                              | Image                                                            | MFR-PN*                                                                                                                                                                                   |
|----------|----------------------------------------|------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1        | ESP32                                  | <img src={img_esp32} width="240" alt="ESP32"/>                   | [SBC-NODEMCU-ESP32](https://joy-it.net/de/products/SBC-NodeMCU-ESP32), [Board Spec](https://joy-it.net/files/files/Produkte/SBC-NodeMCU-ESP32/SBC-NodeMCU-ESP32_Datasheet_2023-09-13.pdf) |
| 1        | USB 2.0, USB A to Micro B plug 60 cm   | <img src={img_usb_cable} width="240" alt="USB cable"/>           | [USB cable - Berrybase](https://www.berrybase.de/usb-2.0-hi-speed-kabel-a-stecker-micro-b-stecker-schwarz/laenge-0-60-m)                                                                  |
| 1        | Breadboard 830 contacts                | <img src={img_breadboard} width="240" alt="Breadboard"/>         | [Breadboard - Berrybase](https://www.berrybase.de/breadboard-mit-830-kontakten)                                                                                                           |
| 20       | Jumper cable, Dupont Male to Male 10cm | <img src={img_jumpers} width="240" alt="Jumper cables"/>         | [DUPK-40-MM-10 - Berrybase](https://www.berrybase.de/40pin-jumper-dupont-kabel-male-male-trennbar/laenge-0-10-m)                                                                          |
| 2        | 100uF 20% 16V                          | <img src={img_cap} width="240" alt="Electrolitic capacitor"/>    | [860020372006](https://www.digikey.de/en/products/detail/w%C3%BCrth-elektronik/860020372006/5727030)                                                                                      |
| 2        | Ceramic 0.1uF 50V                      | <img src={img_cap_ceramic} width="240" alt="Ceramic Capacitor"/> | [K104K15X7RF5TH5](https://www.digikey.de/en/products/detail/vishay-beyschlag-draloric-bc-components/K104K15X7RF5TH5/286555)                                                               |
| 1        | POT 10kΩ 1/8W carbon linear            | <img src={img_pot} width="240" alt="Potenciometer"/>             | [PTN16-A10115K1B1](https://www.digikey.de/en/products/detail/same-sky-formerly-cui-devices/PTN16-A10115K1B1/20380945)                                                                     |
| 1        | NTC 10kΩ 3950K                         | <img src={img_resitor_ntc} width="240" alt="NTC resistor"/>      | [B57891M0103K000](https://www.digikey.de/en/products/detail/tdk/B57891M0103K000/3500546)                                                                                                  |
| 1        | CDS photoresistor 16-33KOHM            | <img src={img_photoresistor} width="240" alt="photoresistor"/>   | [PDV-P8103](https://www.digikey.de/en/products/detail/advanced-photonix/PDV-P8103/480610)                                                                                                 |
| 1        | Switch-NO 0.05A 12V                    | <img src={img_button} width="240" alt="Button"/>                 | [TS02-66-73-BK-100-SCR-D](https://www.digikey.de/en/products/detail/same-sky-formerly-cui-devices/TS02-66-73-BK-100-SCR-D/15634320)                                                       |
| 5        | 220 Ω 5% 1/4W                          |                                                                  | [CF14JT220R](https://www.digikey.de/en/products/detail/stackpole-electronics-inc/CF14JT220R/1741346)                                                                                      |
| 5        | 1 kΩ 5% 1/4W                           |                                                                  | [CF14JT1K00](https://www.digikey.de/en/products/detail/stackpole-electronics-inc/CF14JT1K00/1741314)                                                                                      |
| 5        | 4.7 kΩ 5% 1/4W                         |                                                                  | [CF14JT4K70](https://www.digikey.de/en/products/detail/stackpole-electronics-inc/CF14JT4K70/1741428)                                                                                      |
| 5        | 10 kΩ 5% 1/4W                          |                                                                  | [CF14JT10K0](https://www.digikey.de/en/products/detail/stackpole-electronics-inc/CF14JT10K0/1741265)                                                                                      |
| 1        | LED Red                                | <img src={img_leds} width="240" alt="LEDs"/>                     | [XLUR12D](https://www.digikey.de/en/products/detail/sunled/XLUR12D/4745846)                                                                                                               |
| 1        | LED Green                              |                                                                  | [WP7113GD](https://www.digikey.de/en/products/detail/kingbright/WP7113GD/1747662)                                                                                                         |
| 1        | LED Blue                               |                                                                  | [151051BS04000](https://www.digikey.de/en/products/detail/w%C3%BCrth-elektronik/151051BS04000/4490009)                                                                                    |


*: Manufacturer Product Number (MFR-PN). There is nothing special about these specific MFR-PN, they can be exange with any equivalent component, there are here for completness and tracability of components.

