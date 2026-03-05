# Programming Robots - Session 3

## Warm-up Excercise

Open the turtlesim simulator:

```
ros2 run turtlesim turtlesim_node
```

To control the linear and angular velocities make sure to publish in the topic: `/turtle1/cmd_vel`, and the message type is `geometry_msgs/msg/Twist`.

Your task is to write a publisher that drive the turtle in a way that draw a circle.

## Services

[ROS Services](https://robotics.harleylara.com/en/ros2/services)

## Task - Turtle Controller

Create a ROS 2 node using python that **publishes velocity commands** to turtlesim and exposes **two services** to control motion.

Requeriments:
- Node name: `turtle_controller`
  - Publisher:
    - topics: `/turtle1/cmd_vel`
    - type: `geometry_msgs/msg/Twist`
    - rate: 10 Hz
  - Services:
    - `/start`: When called enable motion.
      - type: `std_srvs/srv/Trigger`
    - `/stop`: When called disable motion.
      - type: `std_srvs/srv/Trigger`

## Actions

[ROS Actions](https://robotics.harleylara.com/en/ros2/actions-)

## QoS

[ROS Services](https://robotics.harleylara.com/en/ros2/qos)

