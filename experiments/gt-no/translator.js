function translate_story(nav) {
  var story_table = document.getElementById("story_table");
  var messages = document.getElementById("messages");
  var translator = document.getElementById("translator");
  var translator_div = document.getElementById("translator_div");
  var idx_store = document.getElementById("idx");
  var serial_store = document.getElementById("serial");
  var nav_buttons = document.getElementById("nav_buttons");
  var next = document.getElementById("next");
  var previous = document.getElementById("prev");
  var translate_button = document.getElementById("translate_button");
  var permalink = document.getElementById("permalink");

  n = parseInt(serial_store.innerHTML);
  if (nav == "prev") {
    n = n-1;
  } else if (typeof nav == "number") {
    n = nav;
  }
  idx = json[n].i;
  title = json[n].t;
  attribution = json[n].a.replace(/^(.)\|(.*?)\|(.*)/, "* Lisens: [CC-$1]\n* Tekst: $2\n* Illustrasjoner: $3\n* Språk: norsk\n").replace(/,/g, ", ").replace(/CC\-b/, "CC-BY").replace(/CC\-n/, "CC-BY-NC");

  sections = json[n].s;

  content_div = "      <table id=\"content_table\">\n        <tr><th style='width:5%'></th><th style='width:30%'>opprinnelig ASP historie</th><th style='width:65%'>oversettelsen din</th></tr><tr>\n          <td><img class=\"thumbnail\" src=\"https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/01.jpg\"></td>\n          <td id=\"title\">Tittel: <i>" + title + "</i></td>\n          <td id=\"story_tgt_title\"><input type=\"text\" id=\"title_text\" /></td></tr><tr>\n";

  messages.innerHTML = "Nå oversettes fortelling #" + idx + " - <i>" + title + "</i> til: <span class=\"editable\" contenteditable=\"true\" id=\"language\" placeholder=\"Målspråk\"></span>";
  var language = document.getElementById("language");
  language.setAttribute("oninput", "check_lang()");
  if (localStorage["trno_l"]) {
    language.innerText = localStorage["trno_l"];
  }
  if (localStorage["trno_a"]) {
    translator.innerText = localStorage["trno_a"];
  }
  translator_div.style.display = '';
  translate_button.style.display = 'none';
  nav_buttons.style.display = 'inline-block';

  check_lang();

  url = location.href.replace(/\?.*/, "");
  permalink.style.display = '';
  permalink.innerHTML = "<a href=\"" + url + "?" + idx + "\">Permalink til denne historien</a><span class=\"dot\"> • </span>";
  for (var i = 0; i < sections.length; i++) {
    page_number = i + 2;
    if (page_number < 10) {
      page_number = "0" + page_number;
    }
    content_div = content_div + "          <td><img class=\"thumbnail\" src=\"https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/" + page_number + ".jpg\"></td>\n          <td id=\"story_src_" + i + "\">" + json[n].s[i][page_number] + "</td>\n          <td><textarea id=\"story_tgt_" + i + "\"></textarea></td>        </tr>"
  }

  translang = "Oversettelse: " + translator.innerText + "<br>* Språk: " + language.innerText;

  story_table = document.getElementById("story_table");
  attribution_row = "          <td></td>\n          <td id=\"attribution\">" + attribution.replace(/\n/g, "<br>") + "</td>\n          <td>" + attribution.replace(/\n/g, "<br>").replace(/Språk: .*/, translang) + "</td>        </tr>";
  story_table.innerHTML = content_div + attribution_row + "      </table>";

  next_story = parseInt(n) + 1;
  prev_story = parseInt(n) - 1;
  next.setAttribute("onclick", "translate_story(" + next_story + ")")
  prev.setAttribute("onclick", "translate_story(" + prev_story + ")")
  nav_buttons.style.display = '';
  idx_store.innerHTML = idx;
  serial_store.innerHTML = n;
  document.getElementById("number_of_sections").innerHTML = sections.length;

  get_storage(idx);
  tr_title.focus();

  document.getElementById("rev_btn").innerHTML = "Gjennomgå";
  document.getElementById("review_sub").style.display = '';

}

function get_storage(idx) {
  number_of_sections = parseInt(document.getElementById("number_of_sections").innerHTML);
  tr_title = document.getElementById("title_text");
  tr_title.setAttribute("oninput", "localStorage['trno_" + idx + "_title']=this.value");
  if (localStorage["trno_" + idx + "_title"]) {
    tr_title.value = localStorage["trno_" + idx + "_title"];
  }
  for (var i = 0; i < number_of_sections; i++) {
    window["story_tgt_" + i].setAttribute("oninput", "localStorage[trno_" + idx + "_s_" + i + "]=this.value");
    if (localStorage["trno_" + idx + "_s_" + i]) {
      window["story_tgt_" + i].value = localStorage["trno_" + idx + "_s_" + i];
    }
  }
  if (localStorage["trno_email"]) {
    document.getElementById("email").value = localStorage["trno_email"];
  }
}

function review_translation() {
  tr_title = document.getElementById("title_text").value;
  attribution = document.getElementById("attribution").innerHTML;
  number_of_sections = parseInt(document.getElementById("number_of_sections").innerHTML);
  var translator = document.getElementById("translator");
  var language = document.getElementById("language");
  translation_output = document.getElementById("translation_output");
  var container = document.getElementById("container");

  content_div = "      <table id=\"content_table\">\n        <tr><th style='width:25%'></th><th style='width:65%'>oversettelsen din</th></tr><tr>\n          <td><img class=\"revthumb\" src=\"https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/01.jpg\"></td>\n          <td><em>" + tr_title + "</em></td></tr><tr>\n";

  format_content = "# " + tr_title + "\n\n##\n";
  for (var i = 0; i < number_of_sections; i++) {
    tr_text = document.getElementById("story_tgt_" + i).value;
    format_content = format_content + tr_text + "\n\n##\n";

    page_number = i + 2;
    if (page_number < 10) {
      page_number = "0" + page_number;
    }
    if (page_number != 0 || page_number != page_number.length) {
      content_div = content_div + "          <td><img class=\"revthumb\" src=\"https://raw.githubusercontent.com/global-asp/asp-imagebank/master/medium/" + idx + "/" + page_number + ".jpg\"></td>\n          <td>" + window["story_tgt_" + i].value + "</td>        </tr>"
    }

  }
  translang = "Oversettelse: " + translator.innerText + "\n* Språk: " + language.innerText;

  translation_output.value = format_content + attribution.replace(/<br>/g, "\n").replace(/Språk: .*/, translang).replace(/Språk:/, "Language:").replace(/Oversettelse:/, "Translation:").replace(/Lisens:/, "License:").replace(/Tekst:/, "Text:").replace(/Illustrasjoner:/, "Illustration:");

  document.getElementById("submit_form").style.display = '';

  format_attribution = "<ul>" + attribution.replace(/Språk: .*/, "") + translang.replace(/\n/g, "<br>") + "</ul>";
  format_attribution = format_attribution.replace(/\* (.*?)</g, "<li>$1</li><").replace(/<br>/g, "");

  var review_table = document.getElementById("review_table");
  review_table.innerHTML = content_div + "<tr><td></td><td>" + format_attribution + "</td></tr></table>";

  document.getElementById("thanks").value = "/experiments/gt-no/thanks.html?" + idx;

  overlay('final');

  prepare_submission();

}

function story_api() {
  var geturl = location.href;
  if (/\?/.test(geturl) == true) {
    var args = /\?(\d+)/.exec(geturl)[1];
    serial = 0;
    for (var n = 0; n < json.length; n++) {
      if (json[n].i == args) {
        serial = n;
        break
      }
    }
    translate_story(serial);
  }
}

function random_story() {
  rand = Math.floor(Math.random()*json.length);
  translate_story(rand);
}

function prepare_submission() {
  var sub = document.getElementById("subject_line");
  var rev = document.getElementById("review_sub");
  sub.value = 'Ny oversettelse: #' + window.idx + ', "' + window.title + '" til ' + window.language.innerHTML + " av " + window.translator.innerText;
  window.name_line.value = window.translator.innerText;
  window.story_number.value = window.idx;
  window.story_language.value = window.language.innerHTML;
  window.md_title.value = window.idx + "_" + window.title_text.value.toLowerCase().replace(/ /g, "-").replace(/[\!\?,\.:'¿¡`]/g, "") + ".md";
  window.story_translation.value = window.translation_output.value;
  rev.style.width = "80%";
  rev.classList.remove("tooltip");
  window.rev_btn.innerHTML = "Fortsett å gjennomgå";
  window.rev_msg.innerHTML = "Hvis du er fornøyd med oversettelsen din, trykk på send-knappen nedenfor for å sende den for inkludering i Global-ASP-prosjektet:";
}

function overlay(w) {
  el = "";
  if (w == "about") {
    el = document.getElementById("about");
  } else if (w == "help") {
    el = document.getElementById("help");
  } else if (w == "final") {
    el = document.getElementById("final");
  }
  el.style.display = (el.style.display == "none") ? "" : "none";
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

function esc_out() {
  window.onkeydown = function(event) {
    if (event.keyCode === 27) {
      about = document.getElementById("about");
      help = document.getElementById("help");
      final = document.getElementById("final");
      about.style.visibility = "hidden";
      about.style.display = "none";
      help.style.visibility = "hidden";
      help.style.display = "none";
      final.style.visibility = "hidden";
      final.style.display = "none";
    }
  }
}

function check_lang() {
  var language = document.getElementById("language");
  localStorage["trno_l"]=language.innerHTML.replace(/\n|<br>/g, "");
  language.style["background-color"] = "#fff";
  var iso = "";
  var full_name = "";
  var msg_bar = document.getElementById("translated_msg");
  msg_bar.style.display = 'none';
  for (var i = 0; i < names.length; i++) {
    for (var n = 0; n < names[i].l.length; n++) {
      if (language.innerHTML.toLowerCase() == names[i].l[n].toLowerCase()) {
        iso = names[i].l[0];
        full_name = names[i].l[1];
      }
    }
    if (iso != "") {
      for (var i = 0; i < gasp.length; i++) {
        if (gasp[i][iso]) {
          idx_array = gasp[i][iso].split(",");
          for (var n = 0; n < idx_array.length; n++) {
            if (idx_array[n] == idx) {
              language.style["background-color"] = "#FF8C8E";
              tr_msg = "This story (#" + idx + ") has already been translated into " + full_name;
              msg_format = "<span style=\"background-color:#FFFFC2;\">" + tr_msg + "</span>";
              msg_bar.innerHTML = msg_format;
              msg_bar.style.display = '';
            }
          }
        }
      }
    }
  }
}
