const availableIDs = [
  "I don’t have any",
  "PSA Birth Certificate",
  "Proof of Residence",
  "Medical Certificate",
  "Transcript of Records",
  "Voter's Certificate",
  "Cedula",
  "Community Tax Declaration Form",
  "Homeowner’s Association Certification",
  "Barangay Clearance/ ID",
  "City ID",
  "Pag-Ibig ID",
  "SSS ID",
  "Passport",
  "PhilSys ID",
  "Driver’s License",
  "UMID",
  "PRC ID",
  "Voter’s Certificate",
  "TIN ID",
  "PhilHealth ID",
  "NBI Clearance",
  "Postal ID",
  "Police Clearance"
];

const dropdownInput = document.getElementById("dropdownInput");
const optionsList = document.getElementById("optionsList");
const selectedTags = document.getElementById("selectedTags");
const clearAllBtn = document.getElementById("clearAllBtn");

let remainingIDs = [...availableIDs];

function renderOptions() {
  optionsList.innerHTML = "";
  remainingIDs.forEach((id) => {
    const option = document.createElement("div");
    option.textContent = id;
    option.addEventListener("click", () => {
      addTag(id);
      remainingIDs = remainingIDs.filter((item) => item !== id);
      renderOptions();
      optionsList.style.display = "none";
    });
    optionsList.appendChild(option);
  });
}

function addTag(id) {
  const tag = document.createElement("div");
  tag.className = "tag";
  tag.innerHTML = `${id} <span class="remove-tag" title="Remove">×</span>`;

  tag.querySelector(".remove-tag").addEventListener("click", () => {
    tag.remove();
    remainingIDs.push(id);
    remainingIDs.sort(
      (a, b) => availableIDs.indexOf(a) - availableIDs.indexOf(b)
    );
    renderOptions();
  });

  selectedTags.appendChild(tag);
}

dropdownInput.addEventListener("click", () => {
  if (remainingIDs.length > 0) {
    optionsList.style.display = "block";
  }
});

document.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown")) {
    optionsList.style.display = "none";
  }
});

clearAllBtn.addEventListener("click", () => {
  const tags = [...selectedTags.children];
  tags.forEach((tag) => tag.remove());
  remainingIDs = [...availableIDs];
  renderOptions();
});

renderOptions();

// Popup logic
const submitBtn = document.querySelector(".submit-btn");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");

submitBtn.addEventListener("click", () => {
  const selected = [...selectedTags.children].map((tag) =>
    tag.childNodes[0].nodeValue.trim()
  );

  if (selected.length === 0) {
    popupMessage.textContent = "No IDs selected.";
    return; // Don’t proceed if empty
  }

  popupMessage.textContent = "Matching these IDs: " + selected.join(", ");
  popup.style.display = "flex";

  // 🔍 Compute outputs
  const fullUserHas = inferIDs(selected);
  const readyDocs = getReadyDocuments(idGraph, fullUserHas);
  const sortedPlan = topologicalSortWithDependencies(idGraph, selected);

  // 💾 Save to localStorage
localStorage.setItem("userHas", JSON.stringify(fullUserHas));

  localStorage.setItem("output1", JSON.stringify(readyDocs));
  localStorage.setItem("output2", JSON.stringify(sortedPlan));

  // 🔁 Redirect after 5 seconds
  setTimeout(() => {
   window.location.href = "/toporder.html";

  }, 2000);
});


