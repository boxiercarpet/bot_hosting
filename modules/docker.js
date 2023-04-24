import Docker from "dockerode";

var docker = new Docker()

// docker.listContainers(function (err, containers) {
//   console.log(err);
//   containers.forEach(function (containerInfo) {
//     console.log(containerInfo);
//   });
// });

export default docker