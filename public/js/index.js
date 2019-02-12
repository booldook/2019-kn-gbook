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
var ref = null;
var user = null;
var key = null;

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
    user = result;
    var email = '<img src="'+result.photoURL+'" style="width:24px;border-radius:50%;"> '+result.email;
    $("#login_bt").hide();
    $("#logout_bt").show();
    $("#user_email").html(email);
  }
  else {
    user = null;
    $("#login_bt").show();
    $("#logout_bt").hide();
    $("#user_email").html('');
  }
  init();
});

/***** Database *****/
function init() {
  $(".gbooks").empty();
  ref = db.ref("root/gbook");
  ref.on("child_added", onAdd);
  ref.on("child_removed", onRev);
  ref.on("child_changed", onChg);
}
function onAdd(data){
  var k = data.key;
  var v = data.val();
  var date = tsChg(v.wdate);
  var icon = "";
  if(user) {
    if(user.uid == v.uid) {
      icon += '<i onclick="onUpdate(this);" class="fas fa-edit"></i> ';
      icon += '<i onclick="onDelete(this);" class="fas fa-trash"></i>';
    }
  }
  var html = '<ul id="'+k+'" data-uid="'+v.uid+'" class="gbook">';
  html += '<li>'+v.uname+' ('+v.email+') | <span>'+date+'</span></li>';
  html += '<li>'+v.content+'</li>';
  html += '<li>'+icon+'</li>';
  html += '</ul>';
  $(".gbooks").prepend(html);
}

function onRev(data) {
  var k = data.key;
  $("#"+k).remove();
}

function onChg(data) {
  var k = data.key;
  var v = data.val();
  $("#"+k).children("li").eq(0).children("span").html(tsChg(v.wdate));
  $("#"+k).children("li").eq(1).html(v.content);
  $("#"+k).find(".fa-edit").show();
}

function zeroAdd(n) {
  if(n<10) return "0"+n;
  else return n;
}

function tsChg(ts) {
  var d = new Date(ts);
  var month = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  var date = String(d.getFullYear()).substr(2)+"년 "+month[d.getMonth()]+zeroAdd(d.getDate())+"일 "+zeroAdd(d.getHours())+":"+zeroAdd(d.getMinutes())+":"+zeroAdd(d.getSeconds());
  return date;
}

$("#save_bt").on("click", function(){
  var $content = $("#content");
  if($content.val() == "") {
    alert("내용을 입력하세요.");
    $content.focus();
  }
  else {
    ref = db.ref("root/gbook");
    ref.push({
      email: user.email,
      uid: user.uid,
      uname: user.displayName,
      content: $content.val(),
      wdate: Date.now()
    }).key;
    $content.val('');
  }
});

function onUpdate(obj) {
  key = $(obj).parent().parent().attr("id");
  var $target = $(obj).parent().prev();
  var v = $(obj).parent().prev().html();
  var html = '<input type="text" class="w3-input w3-show-inline-block w3-border w3-border-red" style="width:calc(100% - 150px);" value="'+v+'">&nbsp;';
  html += '<button type="button" class="w3-button w3-orange" style="margin-top:-4px;" onclick="onUpdateDo(this);">수정</button>';
  html += '<button type="button" class="w3-button w3-black" style="margin-top:-4px;" onclick="onCancel(this, \''+v+'\');">취소</button>';
  $target.html(html);
  $(obj).hide();
}

function onCancel(obj, val) {
  var $target = $(obj).parent().html(val);
  $target.parent().parent().find(".fa-edit").show(); 
}

function onUpdateDo(obj) {
  var $input = $(obj).prev();
  var content = $input.val();
  key = $(obj).parent().parent().attr("id");
  ref = db.ref("root/gbook/"+key).update({
    content: content,
    wdate: Date.now()
  }); 
}

function onDelete(obj) {
  key = $(obj).parent().parent().attr("id");
  if(confirm("정말 삭제하시겠습니까?")) {
    db.ref("root/gbook/"+key).remove();
  }
}