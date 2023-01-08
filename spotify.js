'strict';

const client_id = "dd74c60edd794ab09261cf822ac0d91a";
const client_secret = "84a9bfcc01414abcb19e8a663d1226d6";
const redirect_uri = "http://127.0.0.1:5500/application.html";
const scope = "user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const SEARCH = "https://api.spotify.com/v1/search";
let access_token = null;
let refresh_token = null;


function onPageLoad(){
    if(window.location.search.length > 0){
        redirect();
    }
}

function redirect(){
    console.log("client_id: " + localStorage.getItem("client_id"));
    console.log("client_secret: " + localStorage.getItem("client_secret"));
    let code = getCode();
    getTokens(code);
}

function getCode(){
    let code = window.location.href.split("code=")[1];
    return code;
}

function getAuthorizationCode(){
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    let url = AUTHORIZE + "?client_id=" + client_id + "&response_type=code&redirect_uri=" + encodeURI(redirect_uri) + "&show_dialog=true&scope=" + scope;
    window.location.href = url; //spotify authorization
}

function getTokens(code){
    fetch(TOKEN, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
        },
        body: 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + redirect_uri
      }).then(response => response.json()).then(data => setTokens(data));
}

function setTokens(data){
    console.log(data);
    console.log("access_token: " + data.access_token);
    console.log("refresh_token: " + data.refresh_token);
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
}

function search(){
    console.log("using access_token: " + localStorage.getItem("access_token"));
    let url = SEARCH + "?q=despacito&type=track&limit=5";
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("access_token")
      }
    }).then(response => response.json()).then(data => console.log(data));
}

function refreshToken(){
    fetch(TOKEN, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
        },
        body: 'grant_type=refresh_token&refresh_token=' + localStorage.getItem("refresh_token") + '&client_id=' + localStorage.getItem("client_id")
      }).then(response => response.json()).then(data => setNewAccessToken(data));
}

function setNewAccessToken(data){
    localStorage.setItem("access_token", data.access_token);
    console.log("new access_token: " + data.access_token);
}

