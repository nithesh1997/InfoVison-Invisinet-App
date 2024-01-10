![image info](/src/assets/light-mode/readme-bg-image.png)

# [Console App](#)

The Invisinet React app's code repository.

The Invisinet React app is a <utility/tool/feature> that allows <monitor-traffic-tcp-udp-networks> to do <tansfers of data/between Endpoints/Server and Users>.

## [Installation instructions](#installation-instructions)

### Before you begin, ensure you have met the following requirements:

- You have installed the latest version of NodeJS `v16.13.1`

- You have installed the latest version of [Java Latest Version](https://www.oracle.com/java/technologies/downloads/)

- VSCode `Latest` (Optional)

### Intializing the project

To clone the project, follow these steps:

- Download Cisco's Native VPN Application [Guide](https://invisinet.atlassian.net/wiki/spaces/~63b700e3030d706ab0e638cd/pages/398360577/VPN+Client+Access)

- Get access for GitLab private Invisinet account

- Generate conection with GitLab and SSH keys (read-doc) [Guide](https://docs.gitlab.com/ee/user/ssh.html)

- Clone the repo to your local machine or workspace.

  - Create a folder in your `$HOME` or in your workspace.
  - `git clone git@192.168.120.168:bluearmor-ui/bmc.git`

### Clone Project

To Clone, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'` following the convenctional commit path [Guide](https://www.conventionalcommits.org/en/v1.0.0/)
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

## [Usage instructions](#usage-instructions)

To use Invisinet Console, follow these steps:

- Navigate to the project root directory

  ```BASH
  # Work on Linux, Mac, Windows
  # Mostly try to clone the project under path like this to easily remember
  # $HOME/Workspace/app-invisinet-console/ -> Here `$HOME` is your home directory like `John Doe/`
  $ git clone $HOME/<your projects directory>/<your project name> # you can give suitable name for the project
  ```

- Install dependencies using **npme** in node.

  ```BASH
  # Work on Linux, Mac, Windows
  $ npm i
  ```

- Start React App and Mock Server

  ```BASH
  # Work on Linux, Mac, Windows
  $ npm run start

  # Open another terminal instance
  $ npm run serve
  ```

- Production Ready Build

  ```BASH
  # Work on Linux, Mac, Windows
  $ npm run build
  ```

## [Contribution guidelines](#contribution-guidelines)

Checkout our 👉 [CONTRIBUTING.md](/CONTRIBUTING.md)

## [Code of conduct](#code-of-conduct)

Checkout our 👉 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## [Changelog](#changelog)

Checkout our 👉 [CHANGELOG.md](CHANGELOG.md)

## [License](#license)

The MIT License (MIT)

Copyright © 2023 Invisinet | All Rights Reserved

## [Contributors](#contributors)

Thanks to the following people who have contributed to this project:

- [@dnatarajan](https://192.168.120.168/dnatarajan) ⚙️💻
- [@anguram](https://192.168.120.168/anguram) ⚙️💻
- [@DanielConstante](https://192.168.120.168/DanielConstante) ⚙️💻
- [@nithesh1997](https://192.168.120.168/nithesh1997) 💻
- [@Chan_N](https://192.168.120.168/Chan_N) 💻 `not-active`

## [Contact](#contact)

If you need to contact us you can reach us at

[dinesh.natarajan@invisinet.com](mailto:dinesh.natarajan@invisinet.com)

[anguram.shanmugam@invisinet.com](mailto:anguram.shanmugam@invisinet.com)

[daniel.constante@invisinet.com](mailto:daniel.constante@invisinet.com)

[nithesh.kumar@invisinet.com](mailto:nithesh.kumar@invisinet.com)
