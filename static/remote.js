$(document).ready(function() {

  $("#a_on .myButton").click(function(e) {
    e.preventDefault();
    $.ajax({type: "POST",
            url: "/send",
            data: { code: $("#a_on input")[0].value },
            success: function(result) {
              $(".flash").remove();
              $(".page").prepend("<div class=flash>" + result + "</div>");
    }});
  });

  $("#b_on .myButton").click(function(e) {
    e.preventDefault();
    $.ajax({type: "POST",
            url: "/send",
            data: { code: $("#b_on input")[0].value },
            success: function(result) {
              $(".flash").remove();
              $(".page").prepend("<div class=flash>" + result + "</div>");
    }});
  });

  $("#c_on .myButton").click(function(e) {
    e.preventDefault();
    $.ajax({type: "POST",
            url: "/send",
            data: { code: $("#c_on input")[0].value },
            success: function(result) {
              $(".flash").remove();
              $(".page").prepend("<div class=flash>" + result + "</div>");
    }});
  });

  $("#d_on .myButton").click(function(e) {
    e.preventDefault();
    $.ajax({type: "POST",
            url: "/send",
            data: { code: $("#d_on input")[0].value },
            success: function(result) {
              $(".flash").remove();
              $(".page").prepend("<div class=flash>" + result + "</div>");
    }});
  });

  $("#a_off .myButton").click(function(e) {
    e.preventDefault();
    $.ajax({type: "POST",
            url: "/send",
            data: { code: $("#a_off input")[0].value },
            success: function(result) {
              $(".flash").remove();
              $(".page").prepend("<div class=flash>" + result + "</div>");
    }});
  });

  $("#b_off .myButton").click(function(e) {
    e.preventDefault();
    $.ajax({type: "POST",
            url: "/send",
            data: { code: $("#b_off input")[0].value },
            success: function(result) {
              $(".flash").remove();
              $(".page").prepend("<div class=flash>" + result + "</div>");
    }});
  });

  $("#c_off .myButton").click(function(e) {
    e.preventDefault();
    $.ajax({type: "POST",
            url: "/send",
            data: { code: $("#c_off input")[0].value },
            success: function(result) {
              $(".flash").remove();
              $(".page").prepend("<div class=flash>" + result + "</div>");
    }});
  });

  $("#d_off .myButton").click(function(e) {
    e.preventDefault();
    $.ajax({type: "POST",
            url: "/send",
            data: { code: $("#d_off input")[0].value },
            success: function(result) {
              $(".flash").remove();
              $(".page").prepend("<div class=flash>" + result + "</div>");
    }});
  });


  if (annyang) {
    // Let's define a command.
    var commands = {
      'turn lights on': function() { $("#d_on .myButton").click(); },
      'turn lights off': function() { $("#d_off .myButton").click(); },
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening.
    annyang.start();
  }

});