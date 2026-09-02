type PageAction = "view" | "add";

const path = window.location.pathname;
const actionFromLink: PageAction = path.includes("/view") ? "view" : "add";

const rawId = path.split("/").pop() ?? "";
const parsedId = Number(rawId);
const idFromLink = Number.isFinite(parsedId) ? parsedId : null;

export { actionFromLink, idFromLink, type PageAction };
