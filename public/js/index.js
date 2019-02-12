var config = {
  apiKey: "AIzaSyB10OGY0LJ8r9cg6dITLx4W1WjgY3F_m0E",
  authDomain: "booldook-gbook.firebaseapp.com",
  databaseURL: "https://booldook-gbook.firebaseio.com",
  projectId: "booldook-gbook",
  storageBucket: "booldook-gbook.appspot.com",
  messagingSenderId: "572731860757"
};
firebase.initializeApp(config);

/***** 전역변수 설정 *****/
var log = console.log;
var auth = firebase.auth();
var db = firebase.database();
var googleAuth = new firebase.auth.GoogleAuthProvider();

/***** Auth *****/
$("#login_bt").on("click", function(){
  auth.signInWithPopup(googleAuth);
  //auth.signInWithRedirect(googleAuth);
});
$("#logout_bt").on("click", function(){
  auth.signOut();
});

auth.onAuthStateChanged(function(result){
  if(result) {
    var email = '<img src="'+result.photoURL+'" style="width:24px;box-radius:50%;"> '+result.email;
    $("#login_bt").hide();
    $("#logout_bt").show();
    $("#user_email").html(email);
  }
  else {
    $("#login_bt").show();
    $("#logout_bt").hide();
    $("#user_email").html('');
  }
});