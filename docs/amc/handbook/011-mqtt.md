# MQTT

import publish_subscribe from './mqtt/publish-subscribe.svg'
import topic_tree from './mqtt/topic-tree.svg'
import qos_flows from './mqtt/qos-flows.svg'
import lwt_retained from './mqtt/lwt-retained.svg'
import keep_alive from './mqtt/keep-alive.svg'

In the previous chapters, the ESP32 was used as a local system. Sensors produced electrical signals, the program converted these signals into values, and output devices produced a physical effect. Serial communication made it possible to observe values on a connected computer, but the communication still depended on a direct USB connection between the development board and that computer.

Many embedded systems need to exchange information beyond this local connection. A sensor node may need to send measurements to a server. A dashboard may need to receive values from several devices. Another program may need to switch an output without knowing the IP address or internal implementation of the microcontroller that controls it.

This chapter introduces **MQTT**, a lightweight messaging protocol that is widely used for machine-to-machine communication and Internet of Things systems. The chapter first explains the publish/subscribe model, topics, messages, and Quality of Service. It then introduces retained messages, Last Will messages, sessions, and Keep Alive. Finally, the same concepts are applied in a prepared PlatformIO project that publishes DS18B20 temperature and BMP280 pressure as JSON and subscribes to commands for the built-in LED.

The important transition in this chapter is not merely from a cable to Wi-Fi. It is a transition from a program that operates alone to a **distributed system** in which several independent programs exchange information through a common communication service.

---

## From a Local System to a Distributed System

Consider an ESP32 that reads an LDR and controls an LED.

In a purely local system, the program can read the LDR using `analogRead()` and control the LED using `digitalWrite()` or `analogWrite()`. All relevant information remains inside one microcontroller.


A networked version of the same system may contain several additional components:

- the ESP32 that measures the light level,
- a server that receives and distributes the measurement,

- a desktop program that displays the measurement,
- another ESP32 that reacts to the measurement,
- and a user interface that sends a command to the LED.

These components do not necessarily run at the same time, use the same programming language, or exist on the same physical device. They therefore need an agreed communication protocol.

A direct client/server protocol could require every sensor to know the address and interface of every program that needs its data. This creates a strong dependency between the sender and every receiver. Adding a new dashboard or database may require changes to the sensor program.


MQTT reduces this dependency by introducing an intermediate component called a **broker**. Clients send messages to the broker, and the broker distributes the messages according to subscriptions.

This arrangement does not remove all dependencies. All clients must still agree on the broker, topic structure, payload representation, security rules, and expected message behavior. It does, however, separate the act of producing information from the act of consuming it.

---

## What Is MQTT?

MQTT is a **client/server publish/subscribe messaging protocol**. It is designed to use little network bandwidth and to require a relatively small implementation on the client. These properties make it suitable for embedded systems, remote sensors, mobile devices, and other systems in which computing resources or network quality may be limited.

MQTT was created in 1999 by Andy Stanford-Clark and Arlen Nipper for communication with remote industrial monitoring and control systems. The original application involved oil and gas infrastructure, where devices had to communicate over constrained and unreliable connections.

MQTT later became an open standard. Two versions are especially relevant:

- **MQTT 3.1.1**, which remains widely implemented and is used by the practical ESP32 example in this chapter,
- **MQTT 5.0**, which adds properties, more detailed reason codes, improved session control, topic aliases, request/response support, and other protocol features.

A related protocol named **MQTT-SN** adapts the publish/subscribe principle for sensor networks that may not provide a normal TCP/IP connection.

The current MQTT standards are available from [OASIS](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html), while introductory material and historical information are available from [mqtt.org](https://mqtt.org/).

### The Name MQTT

The course slides expand MQTT as *Message Queue Telemetry Transport*. Historical sources also use names such as *MQ Telemetry Transport* and *Message Queuing Telemetry Transport*. The current standard uses **MQTT** as the protocol name without depending on one expanded form.

The word *queue* can also create a misleading first impression. MQTT brokers may store certain messages and session state, but MQTT is not primarily a work-queue protocol in which one task is removed by one worker. Its central communication model is topic-based publish/subscribe distribution, where one publication can be delivered to zero, one, or many subscribers.

---


## The Publish/Subscribe Model

An MQTT system contains two main types of protocol participant:

- an **MQTT client**,
- an **MQTT broker**.


An MQTT client is any program or device that connects to the broker. An ESP32 can be a client, but so can a desktop program, a web service, a database connector, Node-RED, Home Assistant, or a command-line tool.


A client can perform two communication roles:

- A **publisher** sends a message to a topic.
- A **subscriber** registers interest in one or more topic filters and receives matching messages.

These roles describe actions, not permanent client types. The same client can publish and subscribe during the same connection. An ESP32 may publish sensor values while also subscribing to commands for an LED.

The broker receives all client connections. When a message is published, the broker compares its topic with the active subscriptions and forwards the message to the matching clients.

<div align="center">
| <img src={publish_subscribe} width="900" alt="MQTT publish and subscribe model"/> |
|----|
| MQTT publish and subscribe model. |

</div>

The diagram uses the following example:

1. Client B subscribes to `europe/amsterdam/noord`.
2. Client C subscribes to the same topic.
3. Client A publishes the payload `22 °C` to `europe/amsterdam/noord`.
4. The broker receives the publication.
5. The broker forwards the message to Client B and Client C because their subscriptions match the topic.

Client A does not need to know that Client B and Client C exist. It only needs to know the broker and the topic to which it publishes.


Likewise, Client B does not need to know the network address, programming language, or hardware of Client A. It only needs to subscribe to the agreed topic.


This separation is called **decoupling**.

### Forms of Decoupling

MQTT creates several useful forms of decoupling:

- **Address decoupling:** the publisher does not address each subscriber directly.
- **Implementation decoupling:** clients can use different programming languages and hardware platforms.
- **Cardinality decoupling:** a publisher does not need to know whether zero, one, or many subscribers exist.
- **Timing decoupling:** selected MQTT features can preserve state or messages across temporary disconnections.

Timing decoupling is not automatic for every message. A normal non-retained QoS 0 publication is not historical storage. A client that was disconnected when the message was published will normally not receive that message later. Retained messages and persistent sessions address specific parts of this problem and are introduced later in the chapter.

---

## Clients and Brokers

The distinction between a client and a broker is fundamental.

A **client** initiates a network connection to the broker. It can publish messages, create subscriptions, remove subscriptions, and disconnect.

A **broker** accepts client connections. It validates protocol packets, authenticates clients when authentication is configured, applies authorization rules, matches topic filters, forwards messages, maintains selected session state, stores retained messages, and detects failed connections.


The broker is therefore not merely a passive cable replacement. It is an active communication component with state and policy.

Examples of MQTT brokers include:

- [Eclipse Mosquitto](https://mosquitto.org/),
- EMQX,
- HiveMQ,
- cloud-hosted IoT services,
- and the MQTT service exposed by The Things Stack.

The practical examples in this chapter use Eclipse Mosquitto tools because Mosquitto provides both a broker and the command-line clients `mosquitto_pub` and `mosquitto_sub`.


### Broker Availability

Because clients communicate through the broker, broker availability is a system requirement. When the broker is unavailable, clients cannot exchange MQTT messages through it.

A small local experiment may use one broker running on a laptop or Raspberry Pi. A production system may require monitoring, persistence, backups, redundant broker nodes, load balancing, or a managed service. The correct architecture depends on how much communication loss and downtime the application can tolerate.

---

## Topics


An MQTT publication is not sent to a device address. It is sent to a **topic name**.

A topic name is a UTF-8 string divided into levels using the forward slash `/` character. The levels create a hierarchy that helps organize messages.

For example:


```text
europe/amsterdam/noord/temperature
```


This topic contains four levels:


1. `europe`
2. `amsterdam`
3. `noord`
4. `temperature`

The hierarchy is a naming structure. The broker does not automatically understand that Europe contains Amsterdam or that temperature is a physical quantity. These meanings are created by the system designer and by the programs that agree to use the structure.


<div align="center">
| <img src={topic_tree} width="850" alt="Hierarchical MQTT topic structure"/> |
|----|
| Hierarchical MQTT topic structure. |
</div>

Related measurements can be represented using neighboring topics:

```text
europe/amsterdam/noord/temperature
europe/amsterdam/noord/humidity

europe/amsterdam/oost/temperature
europe/amsterdam/oost/humidity
```

For an AMC project, a topic hierarchy could instead be based on the course, group, device, and signal:

```text
amc/2026/group-07/esp32-01/sensors/ldr
amc/2026/group-07/esp32-01/sensors/potentiometer
amc/2026/group-07/esp32-01/output/led/set
amc/2026/group-07/esp32-01/status
```

This structure makes the purpose and ownership of each topic visible.

### Topic Names Are Case-Sensitive

MQTT topic names are case-sensitive.


The following topic names are different:

```text
europe/amsterdam/noord
Europe/Amsterdam/Noord
```


A subscriber to the first topic will not receive a publication sent to the second topic unless another subscription also matches it.


Case differences are a common source of errors. A project should therefore define one naming convention and use it consistently. Lowercase topic levels are usually easier to maintain.


### Topic Names and Topic Filters

A publisher sends to a **topic name**. A subscriber subscribes using a **topic filter**.

A topic name identifies one exact publication channel:

```text
amc/2026/group-07/esp32-01/sensors/ldr
```

A topic filter may identify that exact topic, or it may contain wildcard characters that match several topics:

```text
amc/2026/group-07/esp32-01/sensors/#
```

Wildcard characters are permitted in subscription filters, but not in the topic name of a `PUBLISH` packet.

This distinction is important. A publisher cannot publish to `sensors/#` and expect the broker to expand the wildcard. The publisher must select one concrete topic name.


### Topic Naming Conventions


The MQTT protocol permits more topic-name forms than should normally be used in a course project. Spaces, non-ASCII UTF-8 characters, empty levels, leading slashes, and trailing slashes can be valid. Validity does not necessarily make a name easy to operate.

The following conventions reduce ambiguity:

- use lowercase letters, digits, hyphens, and underscores,
- use `/` only to separate meaningful levels,
- do not begin or end a topic with `/`,
- do not create empty levels such as `building//temperature`,
- do not use spaces,
- do not include units in a topic unless the unit is part of the interface contract,
- keep device identifiers stable,
- separate measured state from command topics,
- and do not begin application topics with `$`.

Topic names beginning with `$` are conventionally used for broker or system information. For example, some brokers expose statistics below `$SYS/`. These topics are broker-specific and should not be mixed with normal application topics.

### Topics Form an Interface

A topic hierarchy is part of the system interface. Changing it can break every publisher, subscriber, dashboard, rule, database connector, and test script that depends on it.

For this reason, topics should be designed before many clients are deployed. A clear hierarchy should answer questions such as:

- Which organization or project owns the topic?
- Which device or logical subsystem produced the value?
- Does the message describe state, an event, or a command?
- Is the value raw or processed?
- What payload representation and unit are expected?

A topic name alone does not define the complete interface. The payload format, QoS, retained behavior, update frequency, access rules, and meaning of missing messages must also be documented.

---

## Topic Wildcards


Wildcards allow one subscription to match several topic names. MQTT defines two wildcard characters:

- the **single-level wildcard** `+`,
- the **multi-level wildcard** `#`.

Wildcards are used in subscriptions. They are not used in published topic names.

### Multi-Level Wildcard `#`


The `#` wildcard matches zero or more complete topic levels.

It must be the final character of the topic filter. When it follows another level, it must be preceded by `/`.

The filter

```text

europe/amsterdam/noord/#
```

matches all of the following topic names:

```text
europe/amsterdam/noord

europe/amsterdam/noord/temperature
europe/amsterdam/noord/humidity
europe/amsterdam/noord/temperature/celsius
```

It does not match:

```text
europe/amsterdam/oost/temperature
```

The filter matches the parent topic `europe/amsterdam/noord` because `#` is allowed to match zero additional levels.

Only one `#` wildcard can appear in a topic filter, and it must appear at the end.

The following filter is invalid:

```text
europe/#/temperature
```

### Single-Level Wildcard `+`

The `+` wildcard matches exactly one complete topic level.


The filter

```text
europe/amsterdam/+/temperature

```

matches:


```text
europe/amsterdam/noord/temperature
europe/amsterdam/oost/temperature
```

It does not match:

```text

europe/amsterdam/noord/humidity
europe/amsterdam/noord/temperature/celsius
```


The first non-matching topic has the wrong final level. The second contains one additional level.

A `+` wildcard can be used more than once:

```text
europe/+/+/temperature
```

This filter matches one city level and one district level below `europe`.

The MQTT protocol also permits an empty topic level, which means the filter `europe/amsterdam/+/temperature` can technically match `europe/amsterdam//temperature`. The topic is nevertheless difficult to read and should be avoided by following the naming conventions defined above.

### Choosing the Subscription Scope

A broad subscription is convenient during testing:


```text
amc/2026/group-07/#
```

It makes it possible to inspect every message in the group namespace.

The same broad filter may be inappropriate in a deployed application. It can create unnecessary network traffic, expose data that the client does not need, and make authorization rules less precise.

A client should normally subscribe to the narrowest topic filter that matches its required information.

---

## What Is an MQTT Message?

At application level, an MQTT publication can be understood as a combination of several elements:


- a topic name,
- a payload,
- a Quality of Service level,
- a retained flag,
- and, in MQTT 5.0, optional properties.

For example:

```text
Topic:   amc/2026/group-07/esp32-01/sensors/ldr
Payload: 2387
QoS:     0
Retain:  false
```

The topic identifies the information channel. The payload contains the application data.

### The Payload Is a Sequence of Bytes

MQTT does not require one application payload format. The payload can contain text, JSON, a binary sensor representation, an image fragment, a serialized object, or another byte sequence.

For a simple LDR measurement, a decimal string is sufficient:


```text
2387
```

A message containing several measurements may use JSON:

```json
{
    "ldr": 2387,
    "potentiometer": 3110,
    "button": false
}
```

JSON is readable and widely supported, but it adds characters and parsing work. A binary format can be smaller, but is harder to inspect manually. The correct representation depends on the system requirements.

The payload format must be agreed by publishers and subscribers. MQTT transports the bytes, but it does not automatically explain their meaning.

### Values, Units, and Metadata

A payload such as `22` is ambiguous. It could mean 22 degrees Celsius, 22 percent humidity, a raw ADC value, or a device error code.

The ambiguity can be reduced in several ways:

- encode the unit in the topic,
- include the unit in a structured payload,
- define the unit in interface documentation,
- or use MQTT 5 properties where appropriate.

For a stable interface, repeating the unit in every topic may be unnecessary. For example, the topic can remain

```text
building/lab/temperature
```


while the interface specification states that the payload is a decimal temperature in degrees Celsius.

The important requirement is consistency. A publisher should not silently change from degrees Celsius to raw ADC values while keeping the same topic.

### State, Events, and Commands

Messages often represent one of three application concepts:

- **State:** the current condition of something, such as an LED being on.
- **Event:** something that happened, such as a button being pressed.
- **Command:** an instruction requesting a change, such as switching an LED on.

These concepts should not be mixed accidentally.

For example:


```text
amc/2026/group-07/esp32-01/output/led/set
amc/2026/group-07/esp32-01/output/led/state
```

The first topic contains a requested value. The second contains the state that the device reports after applying the command.

This separation becomes important when a command cannot be executed. A dashboard that publishes `on` to the command topic should not assume that the physical LED changed. The device can publish its resulting state, allowing subscribers to distinguish a request from a confirmed result.


---

## MQTT Control Packets

The values described above are transported inside **MQTT Control Packets**.

MQTT 5.0 defines 15 control packet types:

| Group | Control packets |
|---|---|
| Connection | `CONNECT`, `CONNACK`, `DISCONNECT` |
| Publishing | `PUBLISH`, `PUBACK`, `PUBREC`, `PUBREL`, `PUBCOMP` |
| Subscribing | `SUBSCRIBE`, `SUBACK` |
| Unsubscribing | `UNSUBSCRIBE`, `UNSUBACK` |
| Connection check | `PINGREQ`, `PINGRESP` |
| Extended authentication | `AUTH` |

The abbreviations describe the packet purpose:

- `ACK` means acknowledgment,

- `REC` means received,
- `REL` means release,
- `COMP` means complete,

- `REQ` means request,
- `RESP` means response.

Not every MQTT version uses every packet. The `AUTH` packet, for example, belongs to MQTT 5.0 and is not part of MQTT 3.1.1.

### Packet Structure

An MQTT Control Packet contains up to three parts:

1. a **fixed header**,
2. a **variable header**,
3. a **payload**.

The fixed header is present in every control packet. Its first byte contains the control packet type and packet-specific flags. The next field encodes the number of bytes remaining in the packet.

The variable header depends on the packet type. A `PUBLISH` packet contains a topic name in its variable header. Packets that require acknowledgment may contain a packet identifier. MQTT 5.0 packets can also contain a property section with information such as a topic alias, message expiry, authentication data, or maximum packet size.

The payload also depends on the packet type. The payload of a `PUBLISH` packet contains the application message. A `SUBSCRIBE` payload contains topic filters and requested QoS levels. Some packets contain no payload.

The packet format is deliberately compact. A small QoS 0 publication can have very little protocol overhead in addition to the topic and payload.

Application programs normally use an MQTT client library rather than creating packet bytes manually. Understanding the packet groups is nevertheless useful when interpreting network traces, error messages, acknowledgments, connection failures, and Quality of Service behavior.

---

## Establishing a Connection


Before a client can publish or subscribe, it creates a network connection to the broker and sends a `CONNECT` packet.


The broker responds with a `CONNACK` packet. This response indicates whether the MQTT connection was accepted and, depending on the protocol version, provides a return code or reason code and other connection information.


The connection process involves several identities and layers:

1. The client first needs a network path to the broker.
2. A TCP connection is normally established.
3. TLS may protect the transport.
4. The client sends MQTT connection information.
5. The broker authenticates and authorizes the client according to its configuration.
6. The broker accepts or rejects the MQTT connection.

A Wi-Fi connection and an MQTT connection are therefore not the same condition. An ESP32 may be connected to Wi-Fi while the broker is unreachable. It may also reach the broker but be rejected because of an invalid username, password, certificate, protocol version, or client identifier.

### Client Identifier

Every MQTT connection has a **client identifier**. The broker uses this identifier to distinguish clients and, for persistent sessions, to associate a reconnecting client with stored session state.

Client identifiers should be unique within a broker. When two devices connect using the same identifier, the broker normally replaces the existing connection with the new connection. The first device disconnects, reconnects, and may then disconnect the second device. This can create a repeating connection loop that appears to be a network problem even though the actual cause is an identifier collision.

A class exercise should therefore not use the same identifier on every ESP32.

A suitable identifier can include the course, group, and device:

```text
amc-2026-group-07-esp32-01
```

The identifier should remain stable when a persistent session is required. A randomly generated identifier on every connection creates a new session identity each time.

### Graceful Disconnect

A client can end the connection by sending a `DISCONNECT` packet before closing the network connection. This is a **graceful disconnect**.

A graceful disconnect tells the broker that the client intentionally ended the session. The broker therefore does not publish the client's normal Last Will message.

If the network disappears, the device loses power, the program crashes, or the socket closes without the expected `DISCONNECT`, the broker treats the connection as ungraceful. This difference is used by the Last Will mechanism introduced later.

---

## Quality of Service

**Quality of Service**, abbreviated as **QoS**, controls the MQTT delivery exchange between a sending client and the broker, and between the broker and a receiving client.

MQTT defines three levels:


- QoS 0: at most once,
- QoS 1: at least once,
- QoS 2: exactly once.


<div align="center">
| <img src={qos_flows} width="1000" alt="MQTT Quality of Service message flows"/> |
|----|

| Simplified MQTT Quality of Service message flows. Each publisher–broker and broker–subscriber connection performs its own exchange. |
</div>

### QoS 0 — At Most Once


At QoS 0, the sender transmits a `PUBLISH` packet and does not receive an MQTT acknowledgment for that publication.

This behavior is often described as **fire and forget**.

If the packet is lost because the network connection fails, MQTT does not retransmit it at QoS 0. The message may arrive once or may not arrive.


QoS 0 has the smallest protocol exchange and is suitable for values that are published repeatedly and replaced quickly by a newer value. A periodic ambient-light measurement is a typical example. Losing one value may be acceptable because another value will follow after a short interval.

QoS 0 is not appropriate when every individual event must be processed. A one-time alarm or payment instruction should not depend on an unacknowledged publication merely because the packet is small.

### QoS 1 — At Least Once


At QoS 1, the sender transmits a `PUBLISH` packet and waits for a `PUBACK` acknowledgment.


If the acknowledgment does not arrive, the sender can retransmit the publication. This improves delivery reliability, but it introduces the possibility that the receiver sees the same application message more than once.

The receiver may have processed the first copy even though the acknowledgment was lost. The sender cannot know this and sends the publication again.

Applications using QoS 1 must therefore tolerate duplicates. This property is called **idempotence** when processing the same command more than once produces the same final result.

The command


```text
set LED state to on
```

is naturally idempotent. Processing it twice still leaves the LED on.

The command


```text
toggle LED state

```

is not idempotent. Processing it twice returns the LED to its original state.


For distributed control, commands that describe the required final state are generally safer than commands that describe a relative action.

QoS 1 is a common choice when message loss is undesirable and the application can detect or tolerate duplicates.

### QoS 2 — Exactly Once

QoS 2 uses a four-step exchange:


1. `PUBLISH`
2. `PUBREC`
3. `PUBREL`
4. `PUBCOMP`

The additional state and packets allow the MQTT peers to complete delivery exactly once at the MQTT protocol interface, even when retransmission is required.


QoS 2 produces the largest protocol overhead and requires more state at the sender and receiver. It should be selected because the application requires its delivery semantics, not simply because the number 2 appears stronger than the other values.


Exactly-once MQTT delivery is also not a complete transaction for the physical world. A subscriber may receive a command exactly once, actuate a motor, and then lose power before storing that the command was completed. Application-level state, identifiers, acknowledgments, and recovery logic may still be required for critical operations.


### QoS Is Not Priority


The QoS levels should not be interpreted as low, medium, and high message priority.

QoS controls the delivery guarantee and acknowledgment exchange. It does not tell the broker that a QoS 2 message should overtake a QoS 0 message because it is more important.


A critical message may use QoS 1 or 2, but the criticality is an application decision. Priority, deadline, ordering across independent topics, and emergency handling require additional system design.

### QoS Is Applied Per Connection

The delivery from publisher to broker and the delivery from broker to subscriber are separate MQTT exchanges.

Suppose a publisher sends a message to the broker at QoS 2, while a subscriber requested a maximum QoS of 1. The broker can receive the publication using QoS 2 and forward it to that subscriber using QoS 1.

Similarly, a subscriber requesting QoS 2 cannot upgrade a publication that arrived at the broker with QoS 0. The forwarded message cannot have a stronger delivery guarantee than the publication received by the broker.

This distinction matters when describing “end-to-end QoS.” A system designer must inspect both sides of the broker, not only the QoS selected by the publisher.

### Comparing the QoS Levels


| Property | QoS 0 | QoS 1 | QoS 2 |
|---|---|---|---|
| Delivery description | At most once | At least once | Exactly once at the MQTT delivery interface |
| Main acknowledgment packets | None | `PUBACK` | `PUBREC`, `PUBREL`, `PUBCOMP` |
| Message loss possible | Yes | Reduced through retransmission | Reduced through retransmission |
| Duplicate application delivery possible | Not through MQTT retransmission | Yes | Prevented by the QoS 2 exchange |
| Protocol overhead | Lowest | Medium | Highest |
| Typical use | Repeated sensor readings | Important state and commands that tolerate duplicates | Cases that specifically require exactly-once MQTT delivery |

The correct QoS is the lowest level that satisfies the application requirement. Higher QoS is not free reliability. It consumes bandwidth, memory, processing time, and broker state.

---

## Retained Messages

A normal MQTT broker forwards a publication to clients whose subscriptions match at the time of publication. A client that subscribes later does not receive the earlier publication merely because it used the same topic.


A **retained message** changes this behavior.


When a publisher sends a message with the retained flag set, the broker stores that message as the retained message for the exact topic. The broker keeps only the current retained message for that topic, not a complete history.


When a new subscription matches the topic, the broker sends the retained message immediately. The subscriber therefore receives the last known value without waiting for the publisher to send a new update.

For example, a device can publish its current mode as a retained message:

```text
Topic:   amc/2026/group-07/esp32-01/mode
Payload: automatic
Retain:  true

```

A dashboard that starts later can subscribe to the topic and immediately display `automatic`.

This behavior is useful for **state**, because state describes what is currently true.

Retained messages are less suitable for an event stream. Retaining a button-pressed event may cause a new subscriber to process an old event as though it just happened.

### Retained Messages Are Associated with Topics

A retained message belongs to one exact topic. It is not a queue for one subscriber and is not stored separately for every client.

The broker may contain retained messages for all of the following topics at the same time:

```text
building/lab/temperature
building/lab/humidity
building/lab/occupancy
```

Each exact topic can have one current retained message.

### Replacing and Removing a Retained Message

Publishing a new retained message to the same topic replaces the previous retained message.

A retained message can be removed by publishing a retained message with a zero-length payload to that topic. Command-line tools provide an option for sending this empty payload.

Removing a retained value is different from publishing a text payload such as `null`, `none`, or `offline`. Those are normal application values and remain stored as retained messages.

### Last Known Value Is Not Necessarily Current

A retained message is often called the **last known good value**. It is important to understand the limitation of that phrase.

The broker knows that the value was the last retained publication. It does not automatically know whether the value is still physically true.

A retained temperature from yesterday may be the latest stored value while the sensor has been offline for 24 hours. Systems that require freshness should include a timestamp, expiry policy, device status, or another method for detecting stale values.

MQTT 5.0 can attach a Message Expiry Interval, allowing a broker to discard a publication after a defined time. MQTT 3.1.1 applications normally implement freshness through their own payload and status design.

---

## Last Will and Testament

The **Last Will and Testament**, commonly shortened to **Last Will** or **LWT**, allows a client to define a message that the broker should publish if the client disconnects unexpectedly.


The Will is registered as part of the client's `CONNECT` packet. It includes:

- a Will topic,
- a Will payload,
- a Will QoS,
- and a Will retained setting.

For example:

```text
Will topic:   amc/2026/group-07/esp32-01/status
Will payload: offline
Will QoS:     1

Will retain:  true
```

The broker stores this Will configuration while the client is connected.


If the client later sends a normal `DISCONNECT` packet, the broker does not publish the Will. The client ended the connection gracefully.

If the broker detects an ungraceful disconnect, it publishes the Will. Causes can include:


- loss of Wi-Fi or another network connection,
- loss of power at the client,
- a program crash,
- a socket that closes without a normal MQTT disconnect,

- or expiration of the Keep Alive timeout.

The Will is published by the broker, not by the failed device. This is why it can still be sent after the device has lost its connection.

### What a Last Will Proves

A published Will indicates that the broker detected the loss of the MQTT connection.

It does not prove why the connection was lost. The device may have lost power, Wi-Fi may have failed, a router may have restarted, the program may have crashed, or the broker may have closed the connection after a timeout.

The Will also does not prove that every sensor and actuator on the device was functioning before the connection failed. It reports communication status, not complete device health.

A more detailed health model can use additional topics for application heartbeat, sensor validity, supply voltage, error codes, and timestamps.

---


## Combining Last Will and Retained Messages

Last Will and retained messages are frequently combined to implement a simple online/offline status.

The sequence is:

1. The client connects and registers a retained Will containing `offline`.
2. After the connection succeeds, the client publishes retained `online` to the same status topic.
3. The broker stores `online` as the current retained status.
4. New subscribers immediately receive `online`.
5. If the connection fails ungracefully, the broker publishes the retained Will containing `offline`.
6. The broker replaces the retained `online` value with retained `offline`.
7. Current subscribers receive `offline`, and future subscribers also receive `offline` immediately.


<div align="center">
| <img src={lwt_retained} width="900" alt="Combining MQTT Last Will and retained status messages"/> |

|----|
| Online/offline status using a retained publication and a retained Last Will. |
</div>

The status topic could be:


```text
amc/2026/group-07/esp32-01/status
```

The two possible payloads are:


```text
online
offline
```

This pattern is simple and useful, but it still represents the broker's knowledge of the connection. A device can remain connected while its sensor-reading code is blocked or returning invalid values. A complete monitoring system may therefore combine connection status with a timestamped application heartbeat.

### Startup Order

The Will must be configured before the MQTT connection is established because it is transmitted in the `CONNECT` packet.

The retained `online` message must be published only after the broker has accepted the connection. Publishing it before a successful connection is impossible because the MQTT session does not yet exist.


This order will be visible in the ESP32 example later in the chapter.

---


## Sessions

An MQTT **session** contains communication state associated with a client identifier.


Depending on the MQTT version and broker configuration, persistent session state can include:

- subscriptions,
- QoS 1 and QoS 2 messages waiting for delivery,
- in-flight QoS exchanges,
- and related protocol state.


A persistent session allows a client to disconnect and later continue selected communication without recreating all state.

It does not mean that every publication on every topic is stored forever. QoS 0 messages are not normally queued for an offline persistent subscriber, and broker limits can restrict stored messages, expiry, and session duration.

### Clean Session in MQTT 3.1.1

MQTT 3.1.1 uses the **Clean Session** flag in the `CONNECT` packet.

When Clean Session is `true`, the client requests a new session. Previous session state associated with the client identifier is discarded, and the broker does not preserve the session after the connection ends.


When Clean Session is `false`, the client requests a persistent session. The broker can preserve subscriptions and relevant QoS state for later reconnection using the same client identifier.

The ESP32 library used in this chapter provides:

```cpp
mqttClient.setCleanSession(true);
```


A value of `true` is simpler for the first experiment because the program subscribes again after every connection.

### Clean Start and Session Expiry in MQTT 5.0

MQTT 5.0 separates two decisions:

- **Clean Start** controls whether the connection begins with a new session.
- **Session Expiry Interval** controls how long the session remains after disconnection.

This separation allows more precise session behavior than the MQTT 3.1.1 Clean Session flag.

### Client Identifier and Session Identity

A persistent session is associated with the client identifier. Reconnecting with a different identifier does not continue the old session.

This is another reason not to create a new random client identifier on every startup when persistence is required.

It is also a reason to prevent identifier collisions. Two physical devices should not accidentally share one persistent MQTT identity.

---

## Keep Alive

A TCP connection can appear open even when one side has disappeared or a network path has failed. MQTT uses the **Keep Alive** mechanism to limit how long a silent failed connection remains undetected.


The client includes a Keep Alive interval, measured in seconds, in the `CONNECT` packet.


The interval defines the maximum permitted time between MQTT Control Packets sent by the client. Normal traffic such as `PUBLISH`, `SUBSCRIBE`, or acknowledgments counts as MQTT traffic and resets the timer.

When the client has no other MQTT Control Packet to send, it sends `PINGREQ` before the interval expires. The broker replies with `PINGRESP`.

<div align="center">
| <img src={keep_alive} width="820" alt="MQTT Keep Alive exchange"/> |
|----|
| Keep Alive using `PINGREQ` and `PINGRESP` when no other MQTT Control Packet is sent. |
</div>


If the broker does not receive a control packet within one and a half times the Keep Alive interval, the MQTT specification requires it to close the network connection as though the network had failed. A registered Last Will can then be published.

For a Keep Alive of 60 seconds, the client must not remain silent for more than 60 seconds. The broker's failure threshold is 90 seconds.

### Keep Alive Is Not a Sensor Heartbeat

Keep Alive tests the MQTT connection. It does not confirm that the application is producing valid measurements.

An MQTT library may continue sending `PINGREQ` packets while the sensor returns an error value on every reading. The connection is alive, but the measurement function is not healthy.

An application heartbeat can therefore publish information such as:

```json
{

    "uptime_s": 18420,
    "last_measurement_ms": 18399731,
    "sensor_ok": true
}
```

The MQTT Keep Alive and the application heartbeat solve different problems.

### Calling the Client Loop

Many embedded MQTT libraries require a function such as

```cpp
mqttClient.loop();
```

to be called repeatedly.

This function processes incoming packets, sends required acknowledgments and pings, and invokes message callbacks. Long blocking delays or loops can prevent it from running frequently enough.

A program may therefore remain connected during simple tests but fail when a long sensor operation or delay is added. Network protocol processing must be treated as a recurring program responsibility.

---

## Security


MQTT does not make a system secure merely because clients communicate through a broker.

A secure deployment normally considers at least four separate concerns:


- **Confidentiality:** can another party read the messages?
- **Integrity:** can messages be modified during transport?
- **Authentication:** can the broker determine which client is connecting?
- **Authorization:** which topics may that client publish or subscribe to?

### Plain MQTT and TLS

Port `1883` is commonly used for plain MQTT over TCP. The traffic is not encrypted by MQTT itself.

Port `8883` is commonly used for MQTT over TLS. TLS can encrypt the network transport and authenticate the broker using certificates. Mutual TLS can also authenticate the client with a client certificate.

The port number is a convention, not a security guarantee. The actual broker configuration determines which protocol is available.

### Usernames, Passwords, and Access Control Lists

A broker can require a username and password. Authentication establishes an identity, but it does not automatically restrict the topics that identity can access.

Authorization rules, often implemented through an **Access Control List**, can define permissions such as:

```text

client esp32-01 may publish to amc/2026/group-07/esp32-01/sensors/#
client esp32-01 may subscribe to amc/2026/group-07/esp32-01/output/#
```

A device should receive only the permissions required for its function.

### Public Test Brokers

A public test broker is useful for a first experiment because it removes the need to configure a local broker. It must not be treated as a private service.

On a public broker:

- other users may subscribe to the same topic,
- another user may publish to the same topic,
- retained test messages may remain after the experiment,
- availability is not guaranteed,
- and confidential data or real credentials must not be transmitted.

Use a unique topic prefix and publish only test data.

For example:

```text
amc/2026/group-07/random-project-token/esp32-01/...
```


A unique prefix reduces accidental collisions. It does not create authentication or secrecy.

Production systems should use a broker with TLS, controlled accounts, topic authorization, monitoring, and an explicit operational owner.

### Secrets in Source Code


Wi-Fi passwords and broker credentials should not be committed to a public Git repository.

A project can place credentials in a separate header such as `secrets.h` and exclude that file using `.gitignore`. A template file such as `secrets.example.h` can document the required variable names without containing real values.

Separating secrets from source code does not encrypt them on the device. It prevents accidental publication in version control and supports different credentials for different environments.

---


## Practical MQTT Architectures

The same MQTT concepts can be used in systems much larger than one ESP32 and one desktop client.


### Solar Monitoring

A local solar-monitoring system can contain the following path:

```text
solar inverter → local data collector → MQTT broker → home automation system
```

In the example from the course slides, SBFspot runs on a Raspberry Pi and reads data from a solar inverter. The data is then made available through a local Mosquitto broker. Home Assistant can subscribe to the relevant topics and display or process the measurements.

The components are decoupled through MQTT:

- the data collector publishes inverter information,
- the broker distributes it,
- Home Assistant subscribes to the values it needs,
- and another logger or dashboard can be added without changing the inverter connection.


A local broker also allows the system to continue operating inside the local network when an external cloud service is unavailable, provided the required components remain local.

### LoRaWAN and The Things Network

LoRaWAN is designed for long-range, low-power radio communication. A sensor node can send a small uplink over several kilometers to a LoRaWAN gateway.

MQTT is not normally the radio protocol between that sensor node and the gateway. Instead, an MQTT service can be provided at the backend of the LoRaWAN network:

```text
LoRaWAN sensor → gateway → The Things Stack → MQTT client → Node-RED or database
```

The Things Stack exposes MQTT topics for application events, uplinks, and downlinks. A program can subscribe to uplink topics and publish downlink requests without implementing the LoRaWAN network server interface directly.

This illustrates an important integration pattern. MQTT can act as the application-facing communication interface even when the field device uses another physical and link-layer protocol.

At the time of writing, The Things Stack documents its MQTT server as MQTT 3.1.1 with QoS 0. The exact topic structure and authentication format depend on the deployment and should be taken from the current [The Things Stack MQTT documentation](https://www.thethingsindustries.com/docs/integrations/other-integrations/mqtt/).

---

## Practical Task: Connecting the AMC Sensor Station to MQTT


:::warning[Download the project before you start]


This practical task uses a prepared PlatformIO project. Download the archive, extract it, and open the project directory that contains `platformio.ini`.

<a className="button button--primary button--lg" href="/amc/downloads/amc-cloud.zip" download>
  Download amc-cloud.zip
</a>

Do not create an empty PlatformIO project. The archive already contains the required source files, library dependencies, board configuration, and MQTT connection settings.

:::

The practical task connects the sensor system developed in the previous chapters to an MQTT broker. The ESP32 reads two sensors, converts the measurements into a JSON payload, and publishes that payload over Wi-Fi. At the same time, the ESP32 subscribes to two command topics that control the built-in LED.

The completed system follows this communication path:

```text
DS18B20 temperature ─┐
                     ├─> ESP32 ─> Wi-Fi ─> MQTT broker ─> subscriber or dashboard
BMP280 pressure ─────┘

MQTT publisher or dashboard ─> MQTT broker ─> ESP32 ─> built-in LED
```

The project therefore demonstrates both MQTT roles in one client:

- the ESP32 acts as a **publisher** when it sends sensor data,
- the ESP32 acts as a **subscriber** when it receives LED commands.

The practical task uses the public broker `broker.hivemq.com` on port `1883`. This broker is suitable for course experiments, but it does not provide privacy or exclusive ownership of a topic. Do not publish personal, confidential, or safety-critical data.

### Learning Objectives


After completing the task, you should be able to:

- open and configure an existing PlatformIO project,
- identify the relationship between `platformio.ini`, `AMC.h`, and `main.cpp`,
- connect an ESP32 to Wi-Fi and an MQTT broker,
- publish a structured JSON payload,
- subscribe to multiple command topics,
- process incoming MQTT messages using a callback function,
- verify communication using an independent MQTT client,

- and diagnose topic, sensor, Wi-Fi, and broker connection errors.

### Required Hardware and Software


The project is configured for the `esp32doit-devkit-v1` board and uses the following hardware:

- an ESP32 development board,
- a DS18B20 temperature sensor connected to GPIO 33,
- the required pull-up resistor for the DS18B20 data line,
- a BMP280 connected through the default I²C interface used by `Wire.begin()`,

- the built-in LED connected to GPIO 2 on the development board,
- and a USB connection for programming and serial monitoring.

The software requirements are:

- Visual Studio Code,
- the PlatformIO extension,
- and, for independent testing, an MQTT client such as MQTTX, MQTT Explorer, or the Mosquitto command-line tools.

The sensor wiring must be completed before the program is uploaded. The project stops during startup when the BMP280 cannot be initialized, and it rejects a measurement cycle when the DS18B20 cannot be read.

### Opening the Project

Extract `amc-cloud.zip`. The extracted directory contains the complete PlatformIO project:

```text
amc-cloud/
├── include/
│   └── AMC.h
├── lib/
├── src/
│   └── main.cpp
├── test/
└── platformio.ini
```

Open the `amc-cloud` directory in Visual Studio Code. The correct directory is the one that contains `platformio.ini` directly. Opening only the `src` directory prevents PlatformIO from finding the board configuration and library dependencies.

When the project is opened for the first time, PlatformIO downloads the libraries declared in `platformio.ini`:

```ini
lib_deps =
    knolleary/PubSubClient@^2.8
    milesburton/DallasTemperature@^4.0.6
    mahfuz195/BMP280@^1.0.0
```

The project uses:

- **PubSubClient** for MQTT,
- **DallasTemperature** and **OneWire** for the DS18B20,
- and **BMP280** together with `Wire` for the pressure sensor.

### Understanding the Project Files

The project separates configuration from program logic.

| File | Purpose |
|---|---|
| `platformio.ini` | Selects the ESP32 board, declares libraries, and supplies Wi-Fi and MQTT values as build flags. |
| `include/AMC.h` | Checks that the required build flags exist and exposes them as typed constants. |
| `src/main.cpp` | Initializes the sensors, connects to Wi-Fi and MQTT, publishes measurements, and processes LED commands. |

This separation reduces the number of connection parameters written directly into the application code. It also makes it easier to change the broker, port, Wi-Fi network, or output topic without searching through the complete program.

### Configuring a Personal Topic Namespace

Every student must use a unique topic namespace. The supplied project contains the example identifier `naofal`. Replace this identifier with the name or identifier assigned to you for the course.

First, open `platformio.ini` and change the output topic:

```ini
'-D MQTT_OUTPUT_TOPIC_VALUE="/amc/ss2026/nig/your-name"'
```

Use lowercase letters and avoid spaces. For example:

```ini
'-D MQTT_OUTPUT_TOPIC_VALUE="/amc/ss2026/nig/harley"'
```

Next, open `src/main.cpp` and change both subscription topics so that they use the same identifier:

```cpp
const char *LED_TOGGLE_TOPIC =

    "/amc/ss2026/nig/your-name/led/toggle";

const char *LED_RESET_TOPIC =
    "/amc/ss2026/nig/your-name/led/reset";
```


The three topics must belong to the same namespace:

```text
/amc/ss2026/nig/your-name
/amc/ss2026/nig/your-name/led/toggle
/amc/ss2026/nig/your-name/led/reset
```

The supplied course project uses a leading `/` because the course dashboard and its MQTT topics are configured with that exact structure. Earlier in this chapter, omitting a leading slash was recommended as a general topic-design convention. For this practical task, keep the leading slash so that the ESP32, testing client, and dashboard use exactly the same topic names.

A missing slash, a different capitalization, or a different student identifier creates a different topic. MQTT does not correct or normalize topic names.

### Checking the Connection Configuration

The remaining build flags in `platformio.ini` define the Wi-Fi and broker connection:

```ini
build_flags =

    '-D WIFI_SSID_VALUE="..."'
    '-D WIFI_PASSWORD_VALUE="..."'
    '-D MQTT_SERVER_VALUE="broker.hivemq.com"'
    -D MQTT_PORT_VALUE=1883
    '-D MQTT_OUTPUT_TOPIC_VALUE="/amc/ss2026/nig/your-name"'
```


Verify that the Wi-Fi values match the network used during the practical session. Do not publish real passwords in screenshots, reports, or public repositories. Before committing the project to a repository, replace any course-network credentials with placeholders or move them into a private configuration file.

`AMC.h` converts these build flags into constants used by the program:

```cpp
constexpr const char *SSID = WIFI_SSID_VALUE;
constexpr const char *PASSWORD = WIFI_PASSWORD_VALUE;
constexpr const char *MQTT_SERVER = MQTT_SERVER_VALUE;
constexpr uint16_t MQTT_PORT = MQTT_PORT_VALUE;

constexpr const char *MQTT_OUTPUT_TOPIC = MQTT_OUTPUT_TOPIC_VALUE;
```

If one of the required values is missing, compilation stops with a descriptive `#error` message. This is intentional: a missing configuration should be detected during compilation rather than appearing later as an unexplained connection failure.

### Reviewing the Sensor Configuration

The DS18B20 data line is configured on GPIO 33:

```cpp
#define ONE_WIRE_BUS 33

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);

```

The BMP280 uses the I²C interface initialized by:

```cpp

Wire.begin();
```

The program starts the BMP280 in `setup()` and stops if initialization fails:

```cpp
if (!bmp280.begin()) {
    Serial.println(
        "BMP280 initialisation failed. Check wiring and I2C address.");

    while (true) {
        delay(1000);
    }
}
```

This behavior prevents the program from publishing apparently valid data when a required sensor is unavailable.

### Understanding the Published Message

The function `readAndPublishSensors()` reads the DS18B20 temperature and the BMP280 pressure. It then creates one JSON document using `snprintf()`:

```cpp
{"temperature_c":22.31,"pressure_mb":1012.74}
```

The corresponding source code is:

```cpp

int messageLength = snprintf(
    mqttMessage,
    sizeof(mqttMessage),
    "{\"temperature_c\":%.2f,\"pressure_mb\":%.2f}",
    temperature,
    pressure);
```

The program verifies that the formatted text fits into the 128-byte message buffer. If the message is too long, it is not published.


The BMP280 temperature is also read and printed to the Serial Monitor, but the supplied JSON payload contains the DS18B20 temperature and the BMP280 pressure. This distinction is visible in the variable selection passed to `snprintf()`.


The publication uses:

```cpp
mqttClient.publish(MQTT_OUTPUT_TOPIC, mqttMessage);
```

This PubSubClient overload sends the message with QoS 0 and without the retained flag.

### Checking the Publication Interval

The actual publication interval is defined by:


```cpp
const unsigned long PUBLISH_INTERVAL_MS = 5UL * 1000UL;
```

The ESP32 therefore publishes approximately every five seconds while the MQTT connection is active.


A nearby source-code comment says “Publish every 1 minute,” but the constant specifies five seconds. The executable value is determined by the constant, not by the comment. Keep five seconds while testing because the shorter interval makes errors easier to observe. When the experiment is complete, correct the comment or change the constant so that both express the intended interval.

The interval is implemented using `millis()` rather than a five-second `delay()`. This allows `mqttClient.loop()` to run repeatedly between publications and process incoming commands.

### Understanding the MQTT Connection

The program creates one TCP client and passes it to PubSubClient:

```cpp
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
```

The broker address and callback are configured in `setup()`:


```cpp
mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
mqttClient.setCallback(mqttCallback);
```

The connection function generates a mostly unique MQTT client identifier from the ESP32 chip identifier:

```cpp
uint64_t chipId = ESP.getEfuseMac();

snprintf(
    clientId,

    sizeof(clientId),
    "ESP32-%04X",
    static_cast<uint16_t>(chipId & 0xFFFF));
```


This is preferable to assigning the same fixed client identifier to every board. When two clients connect to a broker with the same client identifier, the newer connection can replace the older one.

The username and password strings are empty in the supplied project because the public broker connection does not use account authentication:

```cpp
const char *MQTT_USERNAME = "";
const char *MQTT_PASSWORD = "";
```

The connection function supports credentials when a different broker requires them.

### Subscribing after Every Connection


After a successful MQTT connection, the ESP32 subscribes to both LED topics:

```cpp
mqttClient.subscribe(LED_TOGGLE_TOPIC);
mqttClient.subscribe(LED_RESET_TOPIC);
```


These calls are inside `connectMQTT()` rather than only inside `setup()`. This is necessary because the client may lose its connection and reconnect later. By subscribing after every successful connection, the program does not depend on an earlier subscription still being available.

The main loop attempts an MQTT reconnection every five seconds when the connection is unavailable. It does not continuously call `connect()` as fast as the processor can execute.

### Processing LED Commands

Incoming publications are delivered to `mqttCallback()`:


```cpp
void mqttCallback(char *topic, byte *payload, unsigned int length)
```

The callback compares the received topic with the two configured command topics.


A publication on the toggle topic reverses the current LED state:

```cpp

ledState = !ledState;
digitalWrite(LED_PIN, ledState ? HIGH : LOW);
```


A publication on the reset topic switches the LED off:

```cpp
ledState = false;
digitalWrite(LED_PIN, LOW);
```


The supplied callback does not inspect `payload` or `length`. The command is selected entirely by the topic. Consequently, any payload sent to the toggle topic triggers one toggle, and any payload sent to the reset topic switches the LED off.

This behavior is appropriate for a button-like event, but it differs from a state-setting interface such as a single topic carrying `on` or `off`. A toggle command is also sensitive to duplicate delivery: processing the same toggle twice returns the LED to its original state.

### Building and Uploading the Project


Complete the following sequence:


1. Connect the ESP32 through USB.
2. Confirm that the sensor wiring is complete.

3. Save the changes in `platformio.ini` and `src/main.cpp`.
4. Build the project using the PlatformIO **Build** command.
5. Resolve all compilation errors before uploading.
6. Upload the program to the ESP32.

7. Open the Serial Monitor at `9600` baud.

The startup output should show the following stages:

```text
ESP32 sensor and MQTT system starting...
BMP280 initialised.
Connecting to Wi-Fi...
Wi-Fi connected.
ESP32 IP address: ...
Connecting to MQTT broker as ESP32-.... connected.

Subscribed to /amc/ss2026/nig/your-name/led/toggle
Subscribed to /amc/ss2026/nig/your-name/led/reset
```

After a successful sensor cycle, the Serial Monitor should also show the measurements, generated JSON, and publication result.

### Verifying the Sensor Publication

Do not accept a Serial Monitor message as proof that the broker distributed the data. Verify the publication using a second, independent MQTT client.

With the Mosquitto command-line client, subscribe to your complete namespace:


```bash
mosquitto_sub \
    -h broker.hivemq.com \
    -p 1883 \
    -t '/amc/ss2026/nig/your-name/#' \
    -v
```

Replace `your-name` with the same identifier used by the ESP32.

A successful publication appears in the subscriber terminal in this form:

```text
/amc/ss2026/nig/your-name {"temperature_c":22.31,"pressure_mb":1012.74}
```

The exact values depend on the sensors and environment.

MQTTX or MQTT Explorer can be used instead of `mosquitto_sub`. Connect to `broker.hivemq.com` on port `1883` and subscribe to the same wildcard topic.

### Testing the LED Commands

Publish one message to the toggle topic:

```bash
mosquitto_pub \
    -h broker.hivemq.com \
    -p 1883 \
    -t '/amc/ss2026/nig/your-name/led/toggle' \
    -m 'toggle'
```

The built-in LED should change state. The Serial Monitor should report that a message was received on the toggle topic.

Publish a second toggle message. The LED should return to its previous state.

Then test the reset topic:

```bash
mosquitto_pub \
    -h broker.hivemq.com \
    -p 1883 \
    -t '/amc/ss2026/nig/your-name/led/reset' \
    -m 'reset'
```

The built-in LED should switch off.

The same commands can be sent using the buttons provided by the course dashboard. The topic configured in the dashboard must match the topic in `main.cpp` exactly.

### Required Practical Result

The task is complete when all of the following conditions are satisfied:

- the project builds without errors,
- the ESP32 connects to the intended Wi-Fi network,
- the BMP280 initializes successfully,

- the ESP32 connects to the MQTT broker with its generated client identifier,
- the two LED subscriptions are confirmed in the Serial Monitor,
- a second MQTT client receives the JSON sensor publication,
- one publication to the toggle topic changes the LED state,

- and one publication to the reset topic switches the LED off.

Record the following evidence for your practical documentation:

| Evidence | Required content |
|---|---|
| Topic namespace | The three topics used by your device. |
| Sensor publication | One received JSON message including topic and payload. |
| MQTT connection | The generated client identifier shown in the Serial Monitor. |
| LED control | A short description or image showing the result of toggle and reset. |
| Explanation | Why the subscriptions are recreated after a reconnect and why `mqttClient.loop()` must run repeatedly. |

Do not include the Wi-Fi password in the documentation.

### Analyzing the Program


Answer the following questions after the system works:

1. Which sensor provides the value published as `temperature_c`?
2. Which sensor provides the value published as `pressure_mb`?
3. Why is the BMP280 temperature printed but not included in the JSON payload?
4. What would happen if the output topic used `harley` while the LED topics still used `naofal`?
5. Why are the subscription calls placed inside `connectMQTT()`?
6. What work is performed by `mqttClient.loop()`?
7. Why is a toggle command more sensitive to duplicate delivery than an explicit `on` command?
8. What is the actual publication interval, and why does it differ from the nearby comment?

These questions connect the observed behavior to the MQTT concepts introduced earlier in the chapter.

### Troubleshooting the Supplied Project


#### PlatformIO Reports a Missing Configuration Macro

An error such as

```text
WIFI_SSID_VALUE is not defined in platformio.ini
```

means that a required build flag is missing or malformed. Check the spelling and quoting of all five values in `platformio.ini`.

Also confirm that Visual Studio Code opened the project directory containing `platformio.ini`, not only the `src` directory.

#### The Serial Monitor Prints Connection Dots Continuously

`connectWiFi()` waits until `WiFi.status()` becomes `WL_CONNECTED`. Continuous dots therefore indicate that the Wi-Fi connection has not been established.

Check:

- SSID spelling and capitalization,
- password spelling,
- whether the selected network is available,
- whether the ESP32 can use that network,
- and whether the board is repeatedly resetting because of an unrelated power problem.

#### BMP280 Initialization Fails

The project prints a BMP280 initialization error and remains inside an infinite loop. Check the power, ground, I²C connections, and sensor address expected by the selected library.

Because the program intentionally stops at this point, MQTT connection messages will not appear until the BMP280 initialization succeeds.

#### The DS18B20 Reports `DEVICE_DISCONNECTED_C`

Check:

- the connection to GPIO 33,
- the sensor supply and ground,
- the pull-up resistor on the OneWire data line,
- and the sensor orientation.

The program skips publication when this error occurs.


#### Wi-Fi Works but MQTT Does Not Connect

Check that the broker and port remain:

```text
broker.hivemq.com:1883

```

Also verify that the network permits outbound TCP connections on port `1883`. The Serial Monitor prints the PubSubClient connection state when the connection attempt fails.

A public broker can also be temporarily unavailable. A successful DNS lookup and Wi-Fi connection do not guarantee that the broker is currently reachable.

#### Sensor Data Appears in the Serial Monitor but Not in the Subscriber

Compare the topic character by character. In particular, check:

- the leading `/`,
- `ss2026`,

- `nig`,
- your personal identifier,
- capitalization,
- and the `#` wildcard in the subscriber.

The Serial Monitor prints the JSON before publishing it. This proves that the payload was created, but not that a subscriber used the matching topic.

#### The LED Does Not Respond

First confirm that the Serial Monitor reports an incoming message. If it does not, the problem is most likely the topic, subscription, broker connection, or external publisher.

If the message is reported but the LED does not visibly change, verify that the development board has a controllable built-in LED on GPIO 2. Some boards use a different pin or an active-low LED circuit.

#### MQTT Disconnects Repeatedly

The client identifier is generated from the ESP32 chip ID, which reduces collisions. Repeated disconnects can still be caused by an unstable Wi-Fi connection, broker availability, or another client using the same generated identifier by coincidence.

Observe whether the program prints alternating connection and failure messages. The reconnection attempt is intentionally limited to one attempt every five seconds.


#### The JSON Message Becomes Too Large

The message buffer is:


```cpp
const size_t MQTT_MSG_BUFFER_SIZE = 128;
```

Adding fields to the JSON increases the required length. The existing `snprintf()` check detects truncation. Increase the buffer only when necessary and keep the payload structure concise.

### Optional Extension Tasks


Complete the core task before attempting an extension.

#### Include the BMP280 Temperature

The program already reads `bmpTemperature`. Add a third JSON field:


```json
{
  "temperature_c": 22.31,
  "bmp_temperature_c": 22.68,
  "pressure_mb": 1012.74
}

```

Confirm that the message still fits into `mqttMessage`.

#### Publish the LED State

Add a topic such as:

```text
/amc/ss2026/nig/your-name/led/state
```

Publish `on` or `off` after processing a toggle or reset command. Decide whether the state message should be retained and justify the decision.

#### Replace Toggle with Explicit State Commands

Create one command topic whose payload is `on` or `off`. Compare this interface with the original toggle topic. Explain which design is safer when a QoS 1 publication may be delivered more than once.

#### Add Connection Status

Register a Last Will with the payload `offline` and publish `online` after connecting. Use a retained status topic so that a new subscriber receives the latest known state. This extends the supplied program using the Last Will and retained-message concepts introduced earlier in the chapter.

#### Change the Publication Interval

After testing, change the interval to one minute:

```cpp

const unsigned long PUBLISH_INTERVAL_MS = 60UL * 1000UL;
```

Confirm that LED commands remain responsive while the program waits for the next publication. The program should continue calling `mqttClient.loop()` throughout the interval.

---

## Topic and Message Design Checklist

Before deploying a new MQTT interface, verify the following questions.


### Topic Structure

- Does every level have a defined meaning?

- Is the topic lowercase and consistent?
- Are device identifiers stable and unique?
- Are commands separated from reported state?
- Are broad wildcard subscriptions actually required?

### Payload

- Is the encoding defined?

- Are units and ranges documented?
- Can subscribers detect invalid or stale data?
- Is the payload small enough for all client buffers?
- Is backward compatibility considered when fields change?

### Delivery Behavior

- What happens if the message is lost?
- What happens if the message is duplicated?
- Is the selected QoS justified?
- Should the message be retained?

- Is the message state, an event, or a command?

### Connection and Failure

- Is the client identifier unique?
- Is a persistent session required?
- Is the Keep Alive interval appropriate?
- Is a Last Will defined?
- What does the client do while the broker is unavailable?

### Security


- Is transport encryption required?
- How is the client authenticated?
- Which topics may the client publish and subscribe to?
- Are credentials excluded from version control?
- Is test data separated from production data?

These questions are part of the software and system design. They cannot be solved only by installing an MQTT library.

---


## Summary

MQTT is a lightweight client/server publish/subscribe messaging protocol. Clients connect to a broker, publish messages to topic names, and subscribe using topic filters. A client can publish and subscribe during the same connection.

Topics are hierarchical, case-sensitive strings whose levels are separated using `/`. The `+` wildcard matches one level, while `#` matches zero or more levels at the end of a subscription filter. Wildcards are used for subscriptions and are not valid in published topic names.


An application message contains a topic, payload, Quality of Service, retained behavior, and, in MQTT 5.0, optional properties. MQTT transports payload bytes but does not define the application meaning, units, or encoding.

QoS 0 provides at-most-once delivery without an MQTT acknowledgment. QoS 1 provides at-least-once delivery and can produce duplicates. QoS 2 uses a four-step exchange to provide exactly-once delivery at the MQTT protocol interface. QoS describes delivery behavior, not message priority.

A retained message stores the latest retained publication for one exact topic and sends it to new matching subscribers. A Last Will is registered during connection and published by the broker after an ungraceful disconnect. Combining a retained online message with a retained offline Will creates a simple connection-status pattern.

Persistent sessions preserve selected subscription and QoS state across disconnections. MQTT 3.1.1 uses Clean Session, while MQTT 5.0 uses Clean Start and Session Expiry Interval. Session identity depends on the client identifier.

Keep Alive limits the permitted interval between MQTT Control Packets. When no other packet is sent, the client uses `PINGREQ` and the broker answers with `PINGRESP`. Keep Alive checks the connection, not the validity of sensor data or application logic.

The AMC Cloud practical task combines publishing and subscribing in one ESP32 program. It reads a DS18B20 and BMP280, publishes temperature and pressure as JSON, subscribes to separate LED toggle and reset topics, generates a client identifier from the ESP32 chip ID, and recreates its subscriptions after reconnecting. The practical system remains dependent on exact topic names, correct sensor wiring, repeated MQTT processing, network availability, and responsible use of the public broker.

MQTT provides a communication mechanism. A reliable distributed system still requires explicit decisions about naming, data meaning, failure handling, security, and the physical consequences of received commands.

---

## Further Reading

- [MQTT 5.0 OASIS Standard](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)
- [MQTT 3.1.1 OASIS Standard](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
- [mqtt.org](https://mqtt.org/)
- [Eclipse Mosquitto](https://mosquitto.org/)
- [Mosquitto public test broker](https://test.mosquitto.org/)
- [PubSubClient documentation](https://pubsubclient.knolleary.net/)
- [HiveMQ public MQTT broker](https://www.hivemq.com/public-mqtt-broker/)
- [The Things Stack MQTT integration](https://www.thethingsindustries.com/docs/integrations/other-integrations/mqtt/)
