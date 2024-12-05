import { BlueFoxJs } from "/viewer/modules/BlueFoxJs/bluefox.es.min.js";
BlueFoxJs.Sync.enableSyncViewElement();

(async () => {
  let sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
  let md_path = await (await fetch("/PublicDocuments/map.json")).json();
  await BlueFoxJs.Walker.walkHorizontally(
    {
      _scope_: document,
      "[Viewer]": async ($) => {
        $.element.textContent = "";
        let mark_down = document.createElement("mark-down");
        mark_down.setAttribute("src", md_path[decodeURI(window.location.hash)].path);
        $.element.append(mark_down);
      },
    }
  );
})();
