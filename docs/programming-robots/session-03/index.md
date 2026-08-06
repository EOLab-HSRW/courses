# Session 3

## Warm-up Excercise

[Make it Shine](https://eolab-hsrw.github.io/foxy-docs/docs/exercises/shine)

Reference solution

```
import rclpy

from rclpy.node import Node
from std_msgs.msg import ColorRGBA

class LedController(Node):


    def __init__(self):
        super().__init__("led_controller")

        # /<namespace>/led/front_right/set    std_msgs/msg/ColorRGBA

        # Idea 1

        # self.front_right_publisher = self.create_publisher(ColorRGBA, "led/front_right/set", 10)
        # self.front_left_publisher = self.create_publisher(ColorRGBA, "led/front_left/set", 10)
        # self.rear_right_publisher = self.create_publisher(ColorRGBA, "led/rear_right/set", 10)
        # self.rear_left_publisher = self.create_publisher(ColorRGBA, "led/rear_left/set", 10)
        # self.top_publisher = self.create_publisher(ColorRGBA, "led/top/set", 10)


        # Idea 2
        list_of_topics = [
            "front_right",
            "front_left",
            "rear_right",
            "rear_left",

            "top"
        ]
        self.entities = []

        self.my_msg = ColorRGBA()
        self.my_msg.r = 100.0
        self.toggle = 0

        for topic in list_of_topics:
            self.entities.append(self.create_publisher(ColorRGBA, f"led/{topic}/set", 10))

        self.create_timer(1, self.set_leds)

    def set_leds(self):
        print("Hello from callback")

        if self.toggle == 0:
            self.my_msg.r = 100.0
            self.my_msg.a = 100.0

            self.toggle = 1
        elif self.toggle == 1:

            self.my_msg.r = 100.0
            self.my_msg.a = 0.0

            self.toggle = 0

        for entity in self.entities:
            entity.publish(self.my_msg)


def main(args=None):

    rclpy.init(args=args)


    node = LedController()

    rclpy.spin(node)

    rclpy.try_shutdown()


if __name__ == "__main__":
    main()
```

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

