// for the abstraction of valid id, primary, and secondary
// based from the input, we will check if it is a primary, a secondary or a valid ID
const validIDList = [
  "PhilSys ID",
  "Passport",
  "Driver's License",
  "SSS ID",
  "UMID",
  "Postal ID",
  "PRC ID",
  "Voter's Certificate",
  "TIN ID"
];

function inferIDs(userHas) {
  const primaryIDs = [ 'Passport', 'PhilSys ID', "Driver's License",
        'UMID', 'PRC ID', "Voter's Certificate"];
  const secondaryIDs = ['Barangay Clearance/ID', 'School ID', 'PhilHealth ID',
        'NBI Clearance', 'Police Clearance', 'TIN ID', 'Postal ID'];

    // clean user input
  const inferred = new Set(userHas.map(id => id.trim())); // ✅ make sure it's clean

  let numberOfPrimaryIDs = 0;
  for (const id of primaryIDs) {
    if (inferred.has(id)) 
        numberOfPrimaryIDs++;
  }

  if (numberOfPrimaryIDs >= 1) inferred.add("One Primary ID");
  if (numberOfPrimaryIDs >= 2) inferred.add("Two Primary IDs");

  let numberOfSecondaryIDs = 0;
  for (const id of secondaryIDs) {
    if (inferred.has(id)) 
        numberOfSecondaryIDs++;
  }

  if (numberOfSecondaryIDs >= 2) inferred.add("Two Secondary IDs");

  if (inferred.has("One Primary ID") || inferred.has("Two Secondary IDs")) {
    inferred.add("Valid ID");
  }

  return Array.from(inferred);
}


// toposort for output 2
// to apply topo sort on the ids that have abstract nodes
function topologicalSortWithDependencies(graph, userHas) {
  const visited = {};
  const result = [];

  const inferredSet = new Set(inferIDs(userHas));

  // recursive function

  function dfs(node) {

    // base case
    // if the user already have the document, skip processing it
    if (inferredSet.has(node)) 
        return;

    // flag variable
    visited[node] = true;

    // recursively explore if the vertex is not visited AND the user dont have it
    for (const neighbor of graph[node] || []) {
        //dependencies

        //recursively explore if the vertex is not visited AND the user dont have it
        // Explore if the current ID is not visited and the user don't
      if (!visited[neighbor] && !inferredSet.has(neighbor)) {
        dfs(neighbor);
      }
    }

    // once the requirements are visited, add the vertex to the result (topo order)
    if (!inferredSet.has(node)) {
      result.push(node);
    }

    // simulation that the user already has the current vertex (this ensures that the documents have connection or related)
    inferredSet.add(node);

    // update the list, user now can use that document to acquire for others
    inferIDs(Array.from(inferredSet)).forEach((id) => inferredSet.add(id));
  }

  // for additional exploring to ensure that all vertex will be visited
  for (const node in graph) {
    if (!visited[node]) {
      dfs(node);
    }
  }

  // this is the topo order
  return result;
}

// checks if the user already have the requirements
function isDependencySatisfied(req, userHas) {
  return userHas.includes(req);
}

// returns the documents that are ready to be acquire
function getReadyDocuments(idGraph, userHas) {
  const ready = [];

  // iterate on the vertices in the graph
  for (const id in idGraph) {
    // since the graph is reversed we are accesing the [requirements] of an ID
    const requirements = idGraph[id];

    // Check if all requirements are already acquired
    const isReady = requirements.every((req) =>
      isDependencySatisfied(req, userHas)
    );

    // output the document that is ready to be acquired that the user doesnt have
    if (isReady && !userHas.includes(id)) {
      ready.push(id);
    }
  }
  return ready;
}

// static list
/*
    Legend:
    Target ID : [Requirements or Dependencies]
    B -> A
*/
const idGraph = {
  Passport: ["PSA Birth Certificate", "Valid ID"],
  "PhilSys ID": ["PSA Birth Certificate", "Valid ID"],
  "Driver's License": [
    "PSA Birth Certificate",
    "One Primary ID",
    "Medical Certificate",
  ],
  UMID: ["Valid ID"],
  "PRC ID": [
    "PSA Birth Certificate",
    "One Primary ID",
    "Cedula",
    "Transcript of Records",
    "NBI Clearance",
  ],
  "Voter's Certificate ": ["PSA Birth Certificate", "Proof of Residence"],
  "TIN ID": ["PSA Birth Certificate", "Valid ID"],
  "Barangay Clearance/ID": ["Proof of Residence", "Cedula"],
  "PhilHealth ID": ["PSA Birth Certificate", "One Primary ID"],
  "NBI Clearance": ["Two Primary IDs"],
  "Postal ID": ["Valid ID", "Proof of Residence"],
  Cedula: ["Community Tax Declaration Form"],
  "Proof of Residence": ["Homeowners Association Certification"],
};

console.log("ok");

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector(".submit-btn");
  const selectedTags = document.getElementById("selectedTags");

  let userHas = [];

  submitBtn.addEventListener("click", () => {
   const selectedIDs = [...selectedTags.children].map((tag) =>
  tag.childNodes[0].nodeValue.trim()
);


    userHas = selectedIDs;

    console.log("Selected IDs:", userHas);
    
    const fullUserHas = inferIDs(userHas);
    console.log("You have (after inference): ", fullUserHas);

    console.log("📌 OUTPUT 1 — Ready Documents:");
    const readyDocs = getReadyDocuments(idGraph, fullUserHas);
    console.log(readyDocs);

    console.log("📌 OUTPUT 2 — Suggested Order to Acquire:");
    const sortedPlan = topologicalSortWithDependencies(idGraph, userHas);
    sortedPlan.forEach((doc, i) => {
      console.log(`${i + 1}. ${doc}`);
    });
  });
});
