import bus from "../utils/bus";

export default function UseFlashMessage() {
  function setFlashMessage(message, type) {
    bus.emit("flash", {
      message: message,
      type: type,
    });
  }
  return { setFlashMessage };
}
