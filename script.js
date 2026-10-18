// Quote form submission handler.
// Default behavior: open the user's mail client with a pre-filled message.
// To switch to a webhook, change the SUBMIT_MODE constant and provide a URL.

const SUBMIT_MODE = "mailto"; // "mailto" or "webhook"
const MAILTO_RECIPIENT = "outwestseptic@gmail.com"; // change in form-config.json
const WEBHOOK_URL = ""; // e.g. https://formspree.io/f/xxxxxx

const statusEl = document.getElementById("status");
const form = document.getElementById("quote-form");

function setStatus(msg, kind) {
  statusEl.textContent = msg;
  statusEl.className = "status" + (kind ? " " + kind : "");
}

function buildMessage(data) {
  const services = (data.getAll("service") || []).join(", ") || "(none selected)";
  return [
    "Out West Septic — quote request",
    "",
    "Contact:",
    "  Name:    " + (data.get("name") || ""),
    "  Phone:   " + (data.get("phone") || ""),
    "  Email:   " + (data.get("email") || "(none)"),
    "",
    "Property:",
    "  Address: " + (data.get("address") || ""),
    "  County:  " + (data.get("county") || ""),
    "  Parcel:  " + (data.get("parcel") || "(none)"),
    "",
    "Work:",
    "  Services:        " + services,
    "  Home status:     " + (data.get("home_status") || ""),
    "  Bedrooms:        " + (data.get("bedrooms") || "(not provided)"),
    "  Notes:           " + (data.get("notes") || "(none)"),
    "",
    "— sent from outwestseptic.com/quote",
  ].join("\n");
}

function submitMailto(data) {
  const subject = "Quote request: " + (data.get("name") || "no name");
  const body = buildMessage(data);
  const url =
    "mailto:" + encodeURIComponent(MAILTO_RECIPIENT) +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body);
  window.location.href = url;
}

async function submitWebhook(data) {
  const payload = {};
  for (const [k, v] of data.entries()) payload[k] = v;
  payload.services = data.getAll("service");
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Webhook returned " + res.status);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    setStatus("Please fill in the required fields.", "err");
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  const btn = form.querySelector("button.primary");
  btn.disabled = true;
  setStatus("Sending…", "");
  try {
    if (SUBMIT_MODE === "webhook" && WEBHOOK_URL) {
      await submitWebhook(data);
      setStatus("Got it. We'll be in touch within one business day.", "ok");
      form.reset();
    } else {
      submitMailto(data);
      setStatus(
        "Your mail client should be opening. If it didn't, email " + MAILTO_RECIPIENT + " directly.",
        "ok"
      );
    }
  } catch (err) {
    setStatus("Something went wrong: " + err.message, "err");
  } finally {
    btn.disabled = false;
  }
});
