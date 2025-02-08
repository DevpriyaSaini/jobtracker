async function getAllJobs() {
  const res = await fetch("/job/get-all-jobs");

  const data = await res.json();

  const jobs = data.jobs;

  const jobList = document.getElementById("jobList");

  jobs.forEach((j) => {
    const job = document.createElement("div");

    job.innerHTML = `
        <div class="job" id=${j._id}>
            <div> ${j.jobTitle}</div>
            <div>${j.orderValue}</div>
            <div><a href=${j.fileUrl}>fileUrl</a>
            </div>
            <div>${j.date}</div>
            <button class="delete">Delete</button>
            <button class="edit">Edit</button>
        </div>
        `;

    jobList.appendChild(job);
    
  });

  initializeFunctionality();
}

getAllJobs();

const initializeFunctionality = () => {
  const deletebtns = document.querySelectorAll(".delete");
  

  deletebtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      
      const jobdiv = btn.closest(".job");

      const jobId = jobdiv.getAttribute("id");
      
      if (confirm("Are you sure you want to delete this job?")) {
        const res = await fetch("/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId,
            msg: "dskfjsa",
          }),
        });

        console.log(res.msg);
      }
    });
  });

  //editjob

  const editbtns = document.querySelectorAll(".edit");
  
  

  editbtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      
      const jobdiv = btn.closest(".job");

      const jobId = jobdiv.getAttribute("id");
     

      const jobTitle = prompt("Edit job title:");
      const orderValue = prompt("Edit job salary:");
      const date = prompt("Edit job date:");

      const data = {
        jobTitle,
        orderValue,
        date,
        jobId,
      };
      const res = await fetch("/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
       
      });
      if(res.status==200)
      {
        alert("job updated sucessfully!")
      }

      console.log("res", res);
    });
  });
};


async function searchJobs(event) {

  event.preventDefault(); // Prevent default form submission

  const query = searchForm.querySelector('input[name="query"]').value.trim();
  if (!query) {
    alert("Please enter a search query.");
    return;
  }

  try {
    const res = await fetch(`/job?query=${query}`);
    console.log(res)
    if (!res.ok) throw new Error("Failed to search jobs");

    const data = await res.json();
    console.log(data)
    renderJobs(data.jobs); // Render the filtered jobs
  } catch (error) {
    console.error("Error searching jobs:", error.message);
  }
}


function renderJobs(jobs){
  
  const jobList = document.getElementById("jobList");
  jobList.innerHTML="";

  jobs.forEach((j) => {
    const job = document.createElement("div");

    job.innerHTML = `
        <div class="job" id=${j._id}>
            <div> ${j.jobTitle}</div>
            <div>${j.orderValue}</div>
            <div><a href=${j.fileUrl}>fileUrl</a>
            </div>
            <div>${j.date}</div>
            <button class="delete">Delete</button>
            <button class="edit">Edit</button>
        </div>
        `;

    jobList.appendChild(job);
   
  });
}

const searchForm=document.querySelector("#searchForm");

// Attach search event
searchForm.addEventListener("submit", searchJobs);



