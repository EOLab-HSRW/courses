# Session 3

## Warm-up Excercise

[Make it Shine](https://eolab-hsrw.github.io/foxy-docs/docs/exercises/shine)


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

## ROS Python Client (rclpy) Documentation

You can find the official python client documentation, [rclpy](https://docs.ros.org/en/rolling/p/rclpy/#) to get all the information about the available functions that you can perform with the pythonn client.

Keep in mind the the client documentation pointing to the `rolling` distribution (the latest dev branch) and some functions may not be implemented in your distribution (e.g. Humble).
