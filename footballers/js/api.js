const compete_id = 2014;
const base_url = "https://api.football-data.org/v2/";
const team_url = `${base_url}competitions/${compete_id}/teams`;
const klasemen_url = `${base_url}competitions/${compete_id}/standings`;
const team_info = `${base_url}teams/`;

const fetchAPI = (url) => {
  return fetch(url, {
    method: "GET",
    headers: {
      'X-Auth-Token': `1397c8108db54c8c9b101cbd6a2d273f`
    },
  });
};
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
function json(response) {
  return response.json();
}
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

function getTeams() {
  if ("caches" in window) {
    caches.match(team_url).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var teamsHTML = "";
          data.teams.forEach(function (team) {
            teamsHTML += `
                    <div class="col s12 m4">
                      <div class="card">
                        <a href="./team.html?id=${team.id}">
                          <div class="card-image waves-effect waves-block waves-light">
                            <img src="${team.crestUrl}" />
                          </div>
                        </a>
                        <div class="card-content">
                          <span class="card-title truncate">${team.name}</span>
                        </div>
                      </div>
                      </div>
                    `;
          });
          // Sisipkan komponen card
          document.getElementById("listteam").innerHTML = teamsHTML;
        });
      }
    });
  }

  fetchAPI(team_url)
    .then(status)
    .then(json)
    .then(function (data) {

      // Menyusun komponen card secara dinamis
      let teamsHTML = "";
      data.teams.forEach(function (team) {
        teamsHTML += `
                <div class="col s12 m4">
                  <div class="card">
                    <a href="./team.html?id=${team.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${team.crestUrl}" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${team.name}</span>
                    </div>
                  </div>
                </div>
                `;
      });
      // Sisipkan komponen card 
      document.getElementById("listteam").innerHTML = teamsHTML;
    })
    .catch(error);
}

function getTeamById() {
  // Ambil nilai query parameter (?id=)
  return new Promise(function (resolve, reject) {


    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    fetchAPI(team_info + idParam)
      .then(status)
      .then(json)
      .then(function (data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        console.log(data);
        // Menyusun komponen card secara dinamis
        var teamHTML = `
            
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${data.crestUrl}" />
              </div>
              <div class="card-content">
                <span class="card-title">${data.name}</span>
                <ul>
                <li>Shortname : ${data.shortName}</li>
                <li>Address : ${data.address}</li>
                <li>Phone : ${data.phone}</li>
                <li>Website : <a href="${data.website}">${data.website}</a></li>
                <li>Email : ${data.email}</li>
                <li>Founded : ${data.founded}</li>
                <li>Club Colors : ${data.clubColors}</li>
                <li>Venue : ${data.venue}</li>
                </ul>
              </div>
            </div>
          `;
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = teamHTML;
        resolve(data);
      });
  });
}