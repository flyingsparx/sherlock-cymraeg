var node;
var shown_cards = [];
var asked_questions = [];
var submitted_statements = [];
var scored_cards = [];
var space_pressed = 0;
var last_space_pressed = 0;
var forbid_input = false;
var multiplayer;
var last_successful_request = 0;
var latest_latitude = null;
var latest_longitude = null;

var logging_configs = [
  {url: 'http://logger.cenode.io/cards/sherlock', logged_cards: []},
  {url: 'http://logger2.cenode.io/cards/sherlock', logged_cards: []}
];

var SHERLOCK_CORE = [
  //"conceptualise a ~ sherlock thing ~ S that is an entity and is an imageable thing",
  "cysyniadoli ~ peth sherlock ~ S sydd yn endid ac yn peth y gellir ei delweddu",
  //"conceptualise an ~ organisation ~ O that is a sherlock thing",
  //"cysyniadoli ~ sefydliad ~ O sydd yn peth sherlock",
  //"conceptualise a ~ fruit ~ F that is a sherlock thing and is a locatable thing",
  "cysyniadoli ~ ffrwyth ~ F sydd yn peth sherlock ac yn peth y gellir ei lleoli",
  //"conceptualise a ~ room ~ R that is a location and is a sherlock thing",

  "cysyniadoli ~ ystafell ~ R sydd yn lleoliad ac yn peth sherlock",
  //"conceptualise a ~ shirt colour ~ C",
  "cysyniadoli ~ lliw het ~ C",
  //"conceptualise a ~ sport ~ S",
  "cysyniadoli ~ chwaraeon ~ S",
  //"conceptualise a ~ character ~ C that is a sherlock thing and is a locatable thing and has the shirt colour C as ~ shirt colour ~",
  "cysyniadoli ~ anifail ~ C sydd yn peth sherlock ac yn peth y gellir ei lleoli ac yn cael lliw het C fel ~ lliw het ~",
  //"conceptualise the character C ~ works for ~ the organisation O and ~ eats ~ the fruit F and ~ plays ~ the sport S",
  //"cysyniadoli yr anifail C ~ yn gweithio i ~ y sefydliad O ac ~ yn bwyta ~ y ffrwyth F ac ~ yn chawarae ~ y chwaraeon S",
  "cysyniadoli yr anifail C ~ yn bwyta ~ y ffrwyth F ac ~ yn chwarae ~ y chwaraeon S",
  //"conceptualise the shirt colour C ~ is worn by ~ the character C",
  "cysyniadoli y lliw het C ~ yn cael ei wisgo gan ~ yr anifail C",
  //"conceptualise an ~ object ~ O that is an entity",
  "cysyniadoli ~ gwrthrych ~ O sydd yn endid",
  //"conceptualise the object O ~ resides in ~ the room R",
  "cysyniadoli y gwrthrych O ~ yn preswylio yn ~ yr ystafell R",
  //"conceptualise the room R ~ contains ~ the fruit F and has the character C as ~ contents ~ and has the object O as ~ additional contents ~",
  "cysyniadoli yr ystafell R ~ yn cynnwys ~ y ffrwyth F ac yn cael yr anifail C fel ~ cynnwys ~ ac yn cael y gwrthrych O fel ~ cynnwys ychwanegol ~",
  //"conceptualise the fruit F ~ is eaten by ~ the character C",
  "cysyniadoli y ffrwyth F  ~ yn cael ei fwyta gan ~ yr anifail C",
  //"conceptualise the sport S ~ is played by ~ the character C",
  "cysyniadoli y chwaraeon S  ~ yn cael ei chwarae gan ~ yr anifail C",
  
  "conceptualise a ~ question ~ Q that has the value V as ~ text ~ and has the value W as ~ value ~ and has the value X as ~ relationship ~",
  //"cysyniadoli ~ cwestiwn ~ Q sydd yn cael y gwerth V fel  ~ testun ~ ac yn cael y gwerth W fel  ~ gwerth ~ ac yn cael y gwerth X fel  ~ perthynas ~",
  "conceptualise the question Q ~ concerns ~ the sherlock thing C",
  //"cysyniadoli y cwestion Q ~ yn pryderi ~ y peth sherlock C",

  "there is a rule named r1 that has 'if the character C ~ eats ~ the fruit F then the fruit F ~ is eaten by ~ the character C' as instruction",
  "there is a rule named r2 that has 'if the character C ~ plays ~ the sport S then the sport S ~ is played by ~ the character C' as instruction",
  "there is a rule named r3 that has 'if the character C has the coloured hat S as ~ coloured hat ~ then the coloured hat S ~ is worn by ~ the character C' as instruction",
  "there is a rule named r4 that has 'if the character C ~ is in ~ the room R then the room R has the character C as ~ contents ~' as instruction",
  "there is a rule named r5 that has 'if the fruit F ~ is in ~ the room R then the room R ~ contains ~ the fruit F' as instruction",
  
  // Inverse rules:
  "there is a rule named r6 that has 'if the fruit F ~ is eaten by ~ the character C then the character C ~ eats ~ the fruit F' as instruction",
  "there is a rule named r7 that has 'if the sport S ~ is played by ~ the character C then the character C ~ plays ~ the sport S' as instruction",
  "there is a rule named r8 that has 'if the coloured hat S ~ is worn by ~ the character C then the character C has the coloured hat S as ~ coloured hat ~' as instruction",
  "there is a rule named r9 that has 'if the room R has the character C as ~ contents ~ then the character C ~ is in ~ the room R' as instruction",
  "there is a rule named r10 that has 'if the room R ~ contains ~ the fruit F then the fruit F ~ is in ~ the room R' as instruction",

  //"there is an organisation named 'police'",
  //"there is a character named 'Prof Crane' that has 'http://sherlock.cenode.io/media/crane.png' as image",
  "mae anifail o'r enw 'Eliffant' sydd yn cael 'http://sherlockcymraeg.cenode.io/media/Eliffant.png' fel llun.", // ac yn yr ystafell 'Ystafell Casnewydd' ac yn bwyta y ffrwyth 'oren' ac yn chwarae y chwaraeon 'tenis' ac yn cael lliw het 'gwyrdd' fel lliw het",
  //"there is a character named 'Dr Finch' that has 'http://sherlock.cenode.io/media/finch.png' as image",
  "mae anifail o'r enw 'Jiraff' sydd yn cael 'http://sherlockcymraeg.cenode.io/media/Jiraff.png' fel llun",
  //"there is a character named 'Col Robin' that has 'http://sherlock.cenode.io/media/robin.png' as image",
  "mae anifail o'r enw 'Hipopotamws' sydd yn cael 'http://sherlockcymraeg.cenode.io/media/Hipopotamws.png' fel llun",
  //"there is a character named 'Rev Hawk' that has 'http://sherlock.cenode.io/media/hawk.png' as image",
  "mae anifail o'r enw 'Llewpard' sydd yn cael 'http://sherlockcymraeg.cenode.io/media/Llewpard.png' fel llun",
  //"there is a character named 'Sgt Stork' that has 'http://sherlock.cenode.io/media/stork.png' as image",
  "mae anifail o'r enw 'Llew' sydd yn cael 'http://sherlockcymraeg.cenode.io/media/Llew.png' fel llun",
  //"there is a character named 'Capt Falcon' that has 'http://sherlock.cenode.io/media/falcon.png' as image",
  "mae anifail o'r enw 'Sebra' sydd yn cael 'http://sherlockcymraeg.cenode.io/media/Sebra.png' fel llun",
  //"there is a room named 'Ruby Room'",
  "mae ystafell o'r enw 'Ystafell Casnewydd'",
  //"there is a room named 'Sapphire Room'",
  "mae ystafell o'r enw 'Ystafell Caerdydd'",
  //"there is a room named 'Gold Room'",
  "mae ystafell o'r enw 'Ystafell Blaenafon'",
  //"there is a room named 'Amber Room'",
  "mae ystafell o'r enw 'Ystafell Caernarfon'",
  //"there is a room named 'Emerald Room'",
  "mae ystafell o'r enw 'Ystafell Abertawe'",
  //"there is a room named 'Silver Room'",
  "mae ystafell o'r enw 'Ystafell Aberystwyth'",
  //"there is a fruit named 'pineapple'",
  "mae ffrwyth o'r enw 'pinafal'",
  //"there is a fruit named 'apple'",
  "mae ffrwyth o'r enw 'afal'",
  //"there is a fruit named 'banana'",
  "mae ffrwyth o'r enw 'banana'",
  //"there is a fruit named 'orange'",
  "mae ffrwyth o'r enw 'oren'",
  //"there is a fruit named 'lemon'",
  "mae ffrwyth o'r enw 'lemwn'",
  //"there is a fruit named 'pear'",
  "mae ffrwyth o'r enw 'gellygen'",
  //"there is a shirt colour named 'green'",
  "mae lliw het o'r enw 'gwyrdd'",
  //"there is a shirt colour named 'red'",
  "mae lliw het o'r enw 'coch'",
  //"there is a shirt colour named 'yellow'",
  "mae lliw het o'r enw 'glas'",
  //"there is a shirt colour named 'black'",
  "mae lliw het o'r enw 'pinc'",
  //"there is a shirt colour named 'white'",
  "mae lliw het o'r enw 'melyn'",
  //"there is a shirt colour named 'purple'",
  "mae lliw het o'r enw 'oren'",
  //"there is a sport named 'tennis'",
  "mae chwaraeon o'r enw 'tenis'",
  //"there is a sport named 'badminton'",
  "mae chwaraeon o'r enw 'rygbi'",
  //"there is a sport named 'rugby'",
  "mae chwaraeon o'r enw 'pel droed'",
  //"there is a sport named 'football'",
  "mae chwaraeon o'r enw 'golff'",
  //"there is a sport named 'soccer'",
  "mae chwaraeon o'r enw 'pel fasged'",
  //"there is a sport named 'running'",
  "mae chwaraeon o'r enw 'criced'",

  "there is a rule named objectrule1 that has 'if the object O ~ resides in ~ the room R then the room R has the object O as ~ additional contents ~' as instruction",
  //"mae rehol o'r enw rheolgwrthrych1 sydd yn cael 'os mae y gwrthrych O ~ yn ~ yr ystafell R mae yr ystafell R yn cel y gwrthrych O fel  ~ cynnwys ychwanegol ~' fel cyfarwyddyd",
  //"there is an object named 'gorilla'",
  "mae gwrthrych o'r enw 'gorila'",
  //"there is an object named 'robot'",
  "mae gwrthrych o'r enw 'robot'",
  //"there is an object named 'ghost'",
  "mae gwrthrych o'r enw 'ysbryd'",
  //"there is an object named 'balloon'",
  "mae gwrthrych o'r enw 'balwn'",

  "mae cwestiwn o'r enw 'c1' sydd yn cael 'Pa anifail sydd yn bwyta pinafal?' fel testun ac yn cael 'yn cael ei fwyta gan' fel perthynas ac yn pryderi y peth sherlock 'pinafal'",
  "mae cwestiwn o'r enw 'c2' sydd yn cael 'Pa lliw het ydy&rsquo;r Hipopotamws yn gwisgo?' fel testun ac yn cael 'lliw het' fel gwerth ac yn pryderi y peth sherlock 'hipopotamws'",
  "mae cwestiwn o'r enw 'c3' sydd yn cael 'Pa ffrwyth ydy&rsquo;r Llew yn bwyta?' fel testun ac yn cael 'yn bwyta' fel perthynas ac yn pryderi y peth sherlock 'llew'",
  "mae cwestiwn o'r enw 'c4' sydd yn cael 'Ble mae&rsquo;r afal?' fel testun ac yn cael 'yn' fel perthynas ac yn pryderi y peth sherlock 'afal'",
  "mae cwestiwn o'r enw 'c5' sydd yn cael 'Pa anifail sydd yn yr Ystafell Blaenafon?' fel testun ac yn cael 'cynnwys' fel gwerth ac yn pryderi y peth sherlock 'ystafell blaenafon'",
  "mae cwestiwn o'r enw 'c6' sydd yn cael 'Pa chwaraeon ydy&rsquo;r Sebra yn chwarae?' fel testun ac yn cael 'yn chwarae' fel perthynas ac yn pryderi y peth sherlock 'sebra'",
  "mae cwestiwn o'r enw 'c7' sydd yn cael 'Ble mae&rsquo;r Llewpard?' fel testun ac yn cael 'yn' fel perthynas ac yn pryderi y peth sherlock 'llewpard'",
  "mae cwestiwn o'r enw 'c8' sydd yn cael 'Pa lliw het ydy&rsquo;r Jiraff yn gwisgo?' fel testun ac yn cael 'lliw het' fel gwerth ac yn pryderi y peth sherlock 'jiraff'",
  "mae cwestiwn o'r enw 'c9' sydd yn cael 'Ble mae&rsquo;r lemwn?' fel testun ac yn cael 'yn' fel perthynas ac yn pryderi y peth sherlock 'lemwn'",
  "mae cwestiwn o'r enw 'c10' sydd yn cael 'Pa anifail sydd yn chwarae rygbi?' fel testun ac yn cael 'yn cael ei chwarae gan' fel perthynas ac yn pryderi y peth sherlock 'rygbi'",
  "mae cwestiwn o'r enw 'c11' sydd yn cael 'Pa anifail sydd yn yr Ystafell Caerdydd?' fel testun ac yn cael 'cynnwys' fel gwerth ac yn pryderi y peth sherlock 'ystafell caerdydd'",
  "mae cwestiwn o'r enw 'c12' sydd yn cael 'Ble mae&rsquo;r oren?' fel testun ac yn cael 'yn' fel perthynas ac yn pryderi y peth sherlock 'oren'",
  "mae cwestiwn o'r enw 'c13' sydd yn cael 'Pa anifail sydd yn gwisgo het pinc?' fel testun ac yn cael 'yn cael ei wisgo gan' fel perthynas ac yn pryderi y peth sherlock 'pinc'",
  "mae cwestiwn o'r enw 'c14' sydd yn cael 'Ble mae&rsquo;r Eliffant?' fel testun ac yn cael 'yn' fel perthynas ac yn pryderi y peth sherlock 'eliffant'",
  "mae cwestiwn o'r enw 'c15' sydd yn cael 'Pa ffrwyth ydy&rsquo;r Sebra yn bwyta?' fel testun ac yn cael 'yn bwyta' fel perthynas ac yn pryderi y peth sherlock 'sebra'",
  "mae cwestiwn o'r enw 'c16' sydd yn cael 'Pa anifail sydd yn yr Ystafell Abertawe?' fel testun ac yn cael 'cynnwys' fel gwerth ac yn pryderi y peth sherlock 'ystafell abertawe'",
  "mae cwestiwn o'r enw 'c17' sydd yn cael 'Pa lliw het ydy&rsquo;r Llewpard yn gwisgo?' fel testun ac yn cael 'lliw het' fel gwerth ac yn pryderi y peth sherlock 'llewpard'",
  "mae cwestiwn o'r enw 'c18' sydd yn cael 'Pa chwaraeon ydy&rsquo;r Eliffant yn chwarae?' fel testun ac yn cael 'yn chwarae' fel perthynas ac yn pryderi y peth sherlock 'eliffant'",
  "mae cwestiwn o'r enw 'c19' sydd yn cael 'Pa anifail sydd yn bwyta bananas?' fel testun ac yn cael 'yn cael ei fwyta gan' fel perthynas ac yn pryderi y peth sherlock 'banana'",
  "mae cwestiwn o'r enw 'c20' sydd yn cael 'Ble mae&rsquo;r gellyg?' fel testun ac yn cael 'yn' fel perthynas ac yn pryderi y peth sherlock 'gellygen'",
  "mae cwestiwn o'r enw 'c21' sydd yn cael 'Pa lliw het ydy&rsquo;r Eliffant in gwisgo?' fel testun ac yn cael 'lliw het' fel gwerth ac yn pryderi y peth sherlock 'eliffant'",
  "mae cwestiwn o'r enw 'c22' sydd yn cael 'Pa chwaraeon ydy&rsquo;r Hipopotamws yn chwarae?' fel testun ac yn cael 'yn chwarae' fel perthynas ac yn pryderi y peth sherlock hipopotamws'",
  "mae cwestiwn o'r enw 'c23' sydd yn cael 'Ble mae&rsquo;r Llew?' fel testun ac yn cael 'yn' fel perthynas ac yn pryderi y peth sherlock 'llew'",
  "mae cwestiwn o'r enw 'c24' sydd yn cael 'Pa lliw het ydy&rsquo;r sebra yn gwisgo?' fel testun ac yn cael 'lliw het' fel gwerth ac yn pryderi y peth sherlock 'sebra'",
  "mae cwestiwn o'r enw 'c25' sydd yn cael 'Pa chwaraeon ydy&rsquo;r Llewpard yn chwarae?' fel testun ac yn cael 'yn chwarae' fel perthynas ac yn pryderi y peth sherlock 'llewpard'",
  "mae cwestiwn o'r enw 'c26' sydd yn cael 'Ble mae&rsquo;r Sebra?' fel testun ac yn cael 'yn' fel perthynas ac yn pryderi y peth sherlock 'sebra'",
  "mae cwestiwn o'r enw 'c27' sydd yn cael 'Pa anifail sydd yn bwyta gellygen?' fel testun ac yn cael 'yn cael ei fwyta gan' fel perthynas ac yn pryderi y peth sherlock 'gellygen'",
  "mae cwestiwn o'r enw 'c28' sydd yn cael 'Pa chwaraeon ydy&rsquo;r Llew yn chwarae?' fel testun ac yn cael 'yn chwarae' fel perthynas ac yn pryderi y peth sherlock 'llew'",
  "mae cwestiwn o'r enw 'c29' sydd yn cael 'Pa ffrwyth ydy&rsquo;r Eliffant yn bwyta?' fel testun ac yn cael 'yn bwyta' fel perthynas ac yn pryderi y peth sherlock 'eliffant'",
  "mae cwestiwn o'r enw 'c30' sydd yn cael 'Pa anifail sydd yn chwarae golff?' fel testun ac yn cael 'yn cael ei chwarae gan' fel perthynas ac yn pryderi y peth sherlock 'golff'",
  "mae cwestiwn o'r enw 'c31' sydd yn cael 'Pa anifail sydd yn bwyta oren?' fel testun ac yn cael 'yn cael ei fwyta gan' fel perthynas ac yn pryderi y peth sherlock 'oren'",
  "mae cwestiwn o'r enw 'c32' sydd yn cael 'Pa lliw het ydy&rsquo;r Sebra yn gwisgo?' fel testun ac yn cael 'lliw het' fel gwerth ac yn pryderi y peth sherlock 'sebra'",
  "mae cwestiwn o'r enw 'c33' sydd yn cael 'Pa anifail sydd yn bwyta afal?' fel testun ac yn cael 'yn cael ei fwyta gan' fel perthynas ac yn pryderi y peth sherlock 'afal'",
  "mae cwestiwn o'r enw 'c34' sydd yn cael 'Pa ffrwyth sydd yn yr Ystafell Aberystwyth?' fel testun ac yn cael 'cynnwys' fel perthynas ac yn pryderi y peth sherlock 'ystafell aberystwyth'",
  "mae cwestiwn o'r enw 'c35' sydd yn cael 'Pa anifail sydd yn gwisgo het gwyrdd?' fel testun ac yn cael 'yn cael ei wisgo gan' fel perthynas ac yn pryderi y peth sherlock 'gwyrdd'",
  "mae cwestiwn o'r enw 'c36' sydd yn cael 'Ble mae&rsquo;r Hipopotamws?' fel testun ac yn cael 'yn' fel perthynas ac yn pryderi y peth sherlock 'hipopotamws'",
/*
  "there is a question named 'q1' that has 'What animal eats pineapples?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'pinafal'",
  "there is a question named 'q2' that has 'What sport does Jiraff play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Jiraff'",
  "there is a question named 'q3' that has 'What animal eats apples?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'afal'",
  "there is a question named 'q4' that has 'What colour hat is Eliffant wearing?' as text and has 'coloured hat' as value and concerns the sherlock thing 'Eliffant'",
  "there is a question named 'q6' that has 'Where is Hipopotamws?' as text and has 'is in' as relationship and concerns the sherlock thing 'Hipopotamws'",
  "there is a question named 'q7' that has 'What colour hat is Llew wearing?' as text and has 'coloured hat' as value and concerns the sherlock thing 'Llew'",
  "there is a question named 'q8' that has 'Where is Llew?' as text and has 'is in' as relationship and concerns the sherlock thing 'Llew'",
  "there is a question named 'q9' that has 'Which animal is in the emerald room?' as text and has 'contents' as value and concerns the sherlock thing 'Ystafell Abertawe'",
  "there is a question named 'q12' that has 'What animal eats bananas?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'banana'",
  "there is a question named 'q13' that has 'What animal is in the sapphire room?' as text and has 'contents' as value and concerns the sherlock thing 'Ystafell Caerdydd'",
  "there is a question named 'q17' that has 'What sport does Eliffant play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Eliffant'",
  "there is a question named 'q18' that has 'What animal is wearing a red hat?' as text and has 'is worn by' as relationship and concerns the sherlock thing 'coch'",
  "there is a question named 'q19' that has 'What animal plays rugby?' as text and has 'is played by' as relationship and concerns the sherlock thing 'rygbi'",
  "there is a question named 'q20' that has 'What fruit does Llewpard eat?' as text and has 'eats' as relationship and concerns the sherlock thing 'Llewpard'",
  "there is a question named 'q23' that has 'What fruit does Hipopotamws eat?' as text and has 'eats' as relationship and concerns the sherlock thing 'Hipopotamws'",
  "there is a question named 'q24' that has 'What colour hat is Jiraff wearing?' as text and has 'coloured hat' as value and concerns the sherlock thing 'Jiraff'",
  "there is a question named 'q25' that has 'Where is the apple?' as text and has 'is in' as relationship and concerns the sherlock thing 'afal'",
  "there is a question named 'q26' that has 'What animal is wearing a blue hat?' as text and has 'is worn by' as relationship and concerns the sherlock thing 'glas'",
  "there is a question named 'q28' that has 'What fruit is in the silver room?' as text and has 'contains' as relationship and concerns the sherlock thing 'Ystafell Aberystwyth'",
  "there is a question named 'q30' that has 'What animal is wearing a pink hat?' as text and has 'is worn by' as relationship and concerns the sherlock thing 'pink'",
  "there is a question named 'q31' that has 'What animal eats lemons?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'lemwn'",
  "there is a question named 'q33' that has 'What fruit does Eliffant eat?' as text and has 'eats' as relationship and concerns the sherlock thing 'Eliffant'",
  "there is a question named 'q34' that has 'What animal plays baseball?' as text and has 'is played by' as relationship and concerns the sherlock thing 'baseball'",
  "there is a question named 'q35' that has 'What animal plays soccer?' as text and has 'is played by' as relationship and concerns the sherlock thing 'pel droed'",
  "there is a question named 'q36' that has 'What sport does Llew play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Llew'",
  "there is a question named 'q37' that has 'What animal is in the ruby room?' as text and has 'contents' as value and concerns the sherlock thing 'Ystafell Casnewydd'",
  "there is a question named 'q39' that has 'What animal plays golf?' as text and has 'is played by' as relationship and concerns the sherlock thing 'golff'",
  "there is a question named 'q40' that has 'What animal eats oranges?' as text and has 'is eaten by' as relationship and concerns the sherlock thing 'oren'",
  "there is a question named 'q41' that has 'What colour hat is Sebra wearing?' as text and has 'coloured hat' as value and concerns the sherlock thing 'Sebra'",
  "there is a question named 'q45' that has 'What animal is in the amber room?' as text and has 'contents' as value and concerns the sherlock thing 'Ystafell Caernarfon'",
  "there is a question named 'q47' that has 'Where is Eliffant?' as text and has 'is in' as relationship and concerns the sherlock thing 'Eliffant'",
  "there is a question named 'q48' that has 'Where is the pear?' as text and has 'is in' as relationship and concerns the sherlock thing 'gellygen'",
  "there is a question named 'q50' that has 'What fruit does Llew eat?' as text and has 'eats' as relationship and concerns the sherlock thing 'Llew'",
  "there is a question named 'q52' that has 'What sport does Hipopotamws play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Hipopotamws'",
  "there is a question named 'q53' that has 'Where is Sebra?' as text and has 'is in' as relationship and concerns the sherlock thing 'Sebra'",
  "there is a question named 'q54' that has 'What sport does Sebra play?' as text and has 'plays' as relationship and concerns the sherlock thing 'Sebra'"

  "mae yr anifail 'Hipopotamws' yn bwyta y ffrwyth 'pinafal'.",
  "mae yr anifail 'Hipopotamws' yn cael lliw het 'glas' fel lliw het.",
  "mae yr anifail 'Llew' yn bwyta y ffrwyth 'lemwn'.",
  "mae y ffrwyth 'afal' yn yr ystafell 'Ystafell Aberystwyth'.",
  "mae yr anifail 'Hipopotamws' yn yr ystafell 'Ystafell Blaenafon'.",
  "mae yr anifail 'Sebra' yn chwarae y chwaraeon 'criced'.",
  "mae yr anifail 'Llewpard' yn yr ystafell 'Ystafell Abertawe'.",
  "mae yr anifail 'Jiraff' yn cael lliw het 'coch' fel lliw het.",
  "mae y ffrwyth 'lemwn' yn yr ystafell 'Ystafell Caernarfon'.",
  "mae yr anifail 'Jiraff' yn chwarae y chwaraeon 'rygbi'.",
  "mae yr anifail 'Jiraff' yn yr ystafell 'Ystafell Caerdydd'.",
  "mae y ffrwyth 'oren' yn yr ystafell 'Ystafell Casnewydd'.",
  "mae yr anifail 'Llew' yn cael lliw het 'pinc' fel lliw het.",
  "mae yr anifail 'Eliffant' yn yr ystafell 'Ystafell Casnewydd'.",
  "mae yr anifail 'Sebra' yn bwyta y ffrwyth 'afal'.",
  "mae yr anifail 'Llewpard' yn cael lliw het 'melyn' fel lliw het.",
  "mae yr anifail 'Eliffant' yn chwarae y chwaraeon 'tenis'.",
  "mae yr anifail 'Jiraff' yn bwyta y ffrwyth 'banana'.",
  "mae y ffrwyth 'gellygen' yn yr ystafell 'Ystafell Abertawe'.",
  "mae yr anifail 'Eliffant' yn cael lliw het 'gwyrdd' fel lliw het.",
  "mae yr anifail 'Hipopotamws' yn chwarae y chwaraeon 'pel droed'.",
  "mae yr anifail 'Llew' yn yr ystafell 'Ystafell Caernarfon'.",
  "mae yr anifail 'Sebra' yn cael lliw het 'oren' fel lliw het.",
  "mae yr anifail 'Llewpard' yn chwarae y chwaraeon 'pel fasged'.",
  "mae yr anifail 'Sebra' yn yr ystafell 'Ystafell Abertystwyth'.",
  "mae yr anifail 'Llewpard' yn bwyta y ffrwyth 'gellygen'.",
  "mae yr anifail 'Llew' yn chwarae y chwaraeon 'golff'.",
  "mae yr anifail 'Eliffant' yn bwyta y ffrwyth 'oren'.",
  "mae yr anifail 'Eliffant' yn cael lliw het 'gwyrdd' fel lliw het.",
*/
];

var SHERLOCK_NODE = [
  "there is an agent named 'Mycroft' that has 'http://mycroft.cenode.io' as address",
  "there is a tell policy named 'p2' that has 'true' as enabled and has the agent 'Mycroft' as target",
  "there is a listen policy named 'p4' that has 'true' as enabled and has the agent 'Mycroft' as target"  
];

var settings = {
  logged_in : false,
};

var user = {
  id : null,
  cards : [],
  questions : [],
  answers : [],
  inputs: [],
  input_counter : 0,
  score : 0,
  current_screen : "login"
};

var log = {
  recording_presses : false,
  keypresses : 0,
  start_time : 0,
  end_time : 0
};

var ui = {
  buttons : {
    login : null,
    logout : null,
  },
  inputs : {
    login_user_id : null,
    main_user_id : null,
    text : null,
    guess : null,
    autofill : null,
    multiplayer: null
  },
  overlays : {
    login : null,
    moira : null,
    dashboard: null
  },
  view_changers : [],
  info : {
    cards : null,
    questions : null,
    login_error : null,
    score : null,
    online_status : null
  }
};

function initialize_ui(){
  ui.buttons.login = document.getElementById("login");
  ui.inputs.login_user_id = document.getElementById("login_username");
  ui.inputs.main_user_id = document.getElementById("username");
  ui.inputs.text = document.getElementById("text");
  ui.inputs.guess = document.getElementById("guess");
  ui.inputs.autofill = document.getElementById("autofill");
  ui.inputs.multiplayer = document.getElementById("multiplayer");
  ui.overlays.login = document.getElementById("login_overlay");
  ui.overlays.moira = document.getElementById("moira_overlay");
  ui.overlays.dashboard = document.getElementById("dashboard_overlay");
  ui.info.cards = document.getElementById("cards");
  ui.info.questions = document.getElementById("questions");
  ui.info.login_error = document.getElementById("login_error");
  ui.info.score = document.getElementById("score");
  ui.info.online_status = document.getElementById("online_status");
  ui.view_changers = document.getElementsByClassName("change_view");
}

function bind_listeners(){
  ui.buttons.login.onclick = login;
  ui.inputs.login_user_id.onkeyup = login;
  ui.inputs.text.onkeyup = key_up;
  ui.inputs.text.onkeydown = key_down;
  for(var i = 0; i < ui.view_changers.length; i++){
	  ui.view_changers[i].onclick = function(e){change_view(e.target.getAttribute("data-view"));};
  }
}

function change_view(view){
  user.selected_screen = view;
  update_ui();
}

function login(e){
  if(e && e.keyCode){
    if(e.keyCode !== 13){
      return;
    }
  }
  user.id = ui.inputs.login_user_id.value.charAt(0).toUpperCase() + ui.inputs.login_user_id.value.slice(1);
  user.id = user.id.trim();
  multiplayer = ui.inputs.multiplayer.checked == true;
  if(user.id == null || user.id == ""){
    ui.info.login_error.style.display = "block";
    return;
  }

  if(multiplayer){
    node = new CENode(MODELS.CORE, SHERLOCK_CORE, SHERLOCK_NODE);
    ui.info.online_status.style.display = "block";
    check_online();
  }
  else{
    node = new CENode(MODELS.CORE, SHERLOCK_CORE);
    ui.info.online_status.style.display = "none";
  }
  node.agent.set_name(user.id+" agent");
  window.setTimeout(function(){
    node.add_sentence("there is a tell card named 'msg_{uid}' that is from the agent '"+node.agent.get_name().replace(/'/g, "\\'")+"' and is to the agent '"+node.agent.get_name().replace(/'/g, "\\'")+"' and has the timestamp '{now}' as timestamp and has 'there is an agent named \\'"+node.agent.get_name().replace(/'/g, "\\\'")+"\\'' as content");
    node.add_sentence("there is a feedback policy named 'p3' that has the individual '"+user.id+"' as target and has 'true' as enabled and has 'full' as acknowledgement"); 
  }, 100);

  settings.logged_in = true;  
  user.selected_screen = "moira";
  user.cards = [];
  ui.info.login_error.style.display = "none";

  update_ui();
  load_questions();//fetch_questions();
  poll_for_instances();
  for(var i = 0; i < logging_configs.length; i++){
    log_cards(logging_configs[i]);
  }
}


function add_sentence(t){
  node.add_sentence(t);
}   

function key_down(e){
  if(forbid_input){
    e.preventDefault();
    return false;
  }
  if(e.keyCode == 9){
    e.preventDefault();
    return false;
  }
  if(e.keyCode == 32){
    space_pressed = new Date().getTime();
    if((space_pressed - last_space_pressed) < 400 && ui.inputs.text.value.slice(-1) == ' '){
      if(ui.inputs.text.value.length < ui.inputs.guess.value.length && ui.inputs.autofill.checked == true){
          e.preventDefault();
          ui.inputs.text.value = node.guess_next(ui.inputs.text.value.substring(0, ui.inputs.text.value.length-1)) + " ";
          return false;
      }
    }
    last_space_pressed = new Date().getTime();
  }
}

function key_up(e){
  if(forbid_input){
    e.preventDefault();
    return false;
  }
  if(e.keyCode == 13){
    log.recording_presses = false;
    log.end_time = parseInt(new Date().getTime());
    send();
  }
  else if(e.keyCode == 38){
    if(user.input_counter > 0){
      user.input_counter--;
      ui.inputs.text.value = user.inputs[user.input_counter];     
    }
    e.preventDefault();
  }
  else if(e.keyCode == 40){
    if(user.input_counter < user.inputs.length-1){
      user.input_counter++;
      ui.inputs.text.value = user.inputs[user.input_counter];
    }
    else{
      ui.inputs.text.value = "";
    }
  }
  else if(e.keyCode == 9){
    ui.inputs.text.value = node.guess_next(ui.inputs.text.value);
    e.preventDefault();
    return false;
  }
  else{
    if(log.recording_presses == false){
      log.recording_presses = true;
      log.start_time = parseInt(new Date().getTime());
      log.keypresses = 0;
    }
    log.keypresses++;
  }

  if(ui.inputs.autofill.checked == true){
    ui.inputs.guess.value = node.guess_next(ui.inputs.text.value);
  }
  else{
    ui.inputs.guess.value = "";
  }
}

function send(){
  var input = ui.inputs.text.value.trim().replace(/(\r\n|\n|\r)/gm,"");

  ui.inputs.text.value = "";
  user.inputs.push(input);
  user.input_counter = user.inputs.length;

  var sentence = input.replace(/'/g, "\\'");
  var card;
  if(sentence.toLowerCase().trim() == 'show anomalies'||sentence.toLowerCase().trim() == 'dangos anomaleddau'){
    add_card_simple(sentence, 'user');
    var objects = node.concepts.object.instances;
    for(var i = 0; i < objects.length; i++){
      add_card_simple(node.ce_to_cw(objects[i].gist), 'friend');
    }
    return;
  }
  else if(sentence.toLowerCase().indexOf("who ") == 0 || sentence.toLowerCase().indexOf("what ") == 0 || sentence.toLowerCase().indexOf("where ") == 0 || sentence.toLowerCase().indexOf("list ") == 0 || sentence.toLowerCase().indexOf("beth ") == 0){
    card = "there is an ask card named 'msg_{uid}' that has '"+sentence+"' as content and is to the agent '"+node.agent.get_name().replace(/'/g, "\\'")+"' and is from the individual '"+user.id+"' and has the timestamp '{now}' as timestamp";
    add_card_simple(input, 'user');
  }
  else{
    if(submitted_statements.indexOf(input.toLowerCase()) > -1 ){
      //add_card_simple("I cannot accept duplicate information from the same user.", 'friend');
      add_card_simple("Dydw i ddim yn gallu derbyn gwybodaeth dyblyg o'r un defnyddiwr.", 'friend');
      //return window.alert("The input is invalid or you've already entered this information!");
      return window.alert("Mae'r mewnbwn yn annilys neu rwyt ti wedi cofrestru'r wybodaeth hon yn barod!");
    }
    submitted_statements.push(input.toLowerCase());

    card = "there is an nl card named 'msg_{uid}' that has '"+sentence+"' as content and has '"+sentence+"' as verbatim and is to the agent '"+node.agent.get_name().replace(/'/g, "\\'")+"' and is from the individual '"+user.id+"' and has the timestamp '{now}' as timestamp";

    add_card_simple(input, 'user');
  }
  node.add_sentence(card);
}

function confirm_card(id, content){
  document.getElementById("confirm_"+id).style.display = "none";
  document.getElementById("unconfirm_"+id).style.display = "none";
  forbid_input = false;

  if(submitted_statements.indexOf(content.toLowerCase()) > -1){
    //add_card_simple("I cannot accept duplicate information from the same user.", 'friend');
    add_card_simple("Dydw i ddim yn gallu derbyn gwybodaeth dyblyg o'r un defnyddiwr.", 'ffrind');
    //return window.alert("You have already entered or conifirmed this statement.");
    return window.alert("Rwt ti wedi nodi neu cadarnhau datganiad hwn yn barod.");
  }
  submitted_statements.push(content.toLowerCase());

  //add_card_simple("Yes.", 'user');
  add_card_simple("Ie.", 'user');
  var card = "there is a tell card named 'msg_{uid}' that has '"+content.replace(/'/g, "\\'")+"' as content and is to the agent '"+node.agent.get_name().replace(/'/g, "\\'")+"' and is from the individual '"+user.id+"' and has the timestamp '{now}' as timestamp and is in reply to the card '"+id+"'";
  card+=" and has '"+log.keypresses+"' as number of keystrokes";
  card+=" and has '"+log.end_time+"' as submit time";
  card+=" and has '"+log.start_time+"' as start time";
  if(latest_latitude && latest_longitude){
    card+=" and has '"+latest_latitude+"' as latitude";
    card+=" and has '"+latest_longitude+"' as longitude";
  }

  node.add_sentence(card);
  /*setTimeout(function(){
    ask_question_based_on_input(content);
  }, 1500);*/
}

function unconfirm_card(id){
  document.getElementById("confirm_"+id).style.display = "none";
  document.getElementById("unconfirm_"+id).style.display = "none";
  //add_card_simple("No.", 'user');
  add_card_simple("Na.", 'user');
  //add_card_simple("OK.", 'friend');
  add_card_simple("Iawn.", 'friend');
  forbid_input = false;
}

function update_ui(){
  if(settings.logged_in == true){
    ui.overlays.login.style.display = "none";
    ui.info.score.innerHTML = user.score+' pwynt';
    if(user.selected_screen == "moira"){
      ui.overlays.moira.style.display = "block"; 
      ui.overlays.dashboard.style.display = "none";
    }
    else if(user.selected_screen == "dashboard"){
      ui.overlays.dashboard.style.display = "block";
      ui.overlays.moira.style.display = "none";
    }
  }
  else{
    ui.overlays.login.style.display = "block";
    ui.overlays.moira.style.display = "none"; 
    ui.inputs.login_user_id.value = "";
    ui.info.cards.innerHTML = "";
  }
}

function add_card_simple(text, user){
  ui.info.cards.innerHTML += '<li class="card '+user+'"><p>'+text+'</p></li>';
  ui.info.cards.scrollTop = ui.info.cards.scrollHeight;
}

function add_card(card){
  var content = card.content;
  var id = card.name;
  var tos = card.is_tos.map(function(to){
    return to.name.toLowerCase();
  });
  var from = card.is_from.name;
  var card_type = card.type;
  var linked_content = card.linked_content;
  
  if(!content){return;}

  var eng = content;
  content = node.ce_to_cw(content);
  //if (content != eng) console.log("CE:"+eng+"\nCW:"+content);
  
  if(id == null || (id != null && shown_cards.indexOf(id) == -1)){
    shown_cards.push(id);
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    var c = '<li class="card';
    if(tos && tos.indexOf(user.id) > -1){c+=' user';}
    else{
      c+=' friend';
      if(navigator.vibrate){
        navigator.vibrate([70,40,200]);
      }
    }
    c+='">';
    c+='<p>';
    if(card_type != null && card_type.name == "confirm card"){
      //c+='OK. Is this what you meant?<br /><br />';
      c+='Iawn. A yw hyn yn beth oeddet yn ei olygu?<br /><br />';
    }
    c+=content.replace(/(?:\r\n|\r|\n)/g, ' <br /> ').replace(/  /g, '&nbsp;&nbsp;')+'</p>';
    if(card_type != null && card_type.name == "confirm card"){
      c+='<button id="confirm_'+id+'" class="confirm" onclick="confirm_card(\''+id+'\', \''+content.replace(/'/g, "\\'")+'\')">Ie</button>';
      c+='<button id="unconfirm_'+id+'" class="unconfirm" onclick="unconfirm_card(\''+id+'\')">Na</button>';
      forbid_input = true;
    }
    if(linked_content != null){
      c+='<img src="'+linked_content+'" alt="Attachment" />';
    }
    c+='</li>';
    ui.info.cards.innerHTML+=c;
    ui.info.cards.scrollTop = ui.info.cards.scrollHeight;
  }
}

function get_question_state(q){
  if(q.responses.length == 0){return "unanswered";}
  else if(q.responses.length < 3){return "unconfident";}
  else{
    var responses = {};
    var response_vols = [];
    for(var j = 0; j < q.responses.length; j++){
      if(!(q.responses[j] in responses)){responses[q.responses[j]] = 0;}
      responses[q.responses[j]]++;
    }
    for(key in responses){response_vols.push(responses[key]);}
    response_vols.sort().reverse();
    if(response_vols.length == 1){return "answered";}
    else if(response_vols.length > 1 && (response_vols[0]-response_vols[1]) >= 3){return "answered";}
    else{return "contested";}
  }
}

function load_questions(){
  var qs = node.get_instances("question");
  for(var i = 0; i < qs.length; i++){
    var q = {};
    q.responses = [];
    for(var j = 0; j < qs[i].values.length; j++){
      var ins_name = typeof qs[i].values[j].instance == 'string' ? qs[i].values[j].instance : qs[i].values[j].instance.name;
      q[qs[i].values[j].label] = ins_name;
    }
    for(var j = 0; j < qs[i].relationships.length; j++){
      q[qs[i].relationships[j].label] = qs[i].relationships[j].instance.name;
    }
    user.questions.push(q);
  }
}

function poll_for_instances(){
  if(node == null){
    return;
  }
  setTimeout(function(){
    var ins = node.get_instances();
    for(var i = 0; i < user.questions.length; i++){user.questions[i].responses = [];}
    for(var i = 0; i < ins.length; i++){
      // Detect if type of card. If so, filter and add to UI if necessary
      if(ins[i].type.name.indexOf("card") > -1){
        var tos = ins[i].is_tos;
        if(tos){for(var j = 0; j < tos.length; j++){
          if(tos[j].name.toLowerCase() == user.id.toLowerCase()){
            add_card(ins[i]);
          }
        }}
      }
      else{
        for(var j = 0; j < user.questions.length; j++){
          var instance = ins[i];
          var question = user.questions[j];
          if(question.concerns.toLowerCase() == instance.name.toLowerCase()){
            if(question.value != null){
              for(var k = 0; k < instance.values.length; k++){
                if(instance.values[k].label == question.value){
                  if(typeof instance.values[k].instance == "string"){
                    question.responses.push(instance.values[k].instance.toLowerCase());
                  }
                  else{
                    question.responses.push(instance.values[k].instance.name.toLowerCase());
                  }
                }
              }
            }
            if(question.relationship != null){
              for(var k = 0; k < instance.relationships.length; k++){
                if(instance.relationships[k].label == question.relationship){
                  question.responses.push(instance.relationships[k].instance.name.toLowerCase());
                }
              }
            }
          }
        }
      }
    }
    ui.info.questions.innerHTML = "";
    user.score = 0;
    var ratios = {};
    for(var i = 0; i < user.questions.length ; i++){
      var state = get_question_state(user.questions[i]);
      ui.info.questions.innerHTML += '<li onclick="alert(\''+user.questions[i].text+'\');" class="response question '+state+'">'+(i+1)+'</li>';
      if(state == 'answered'){
        user.score++;
      }
      if(!(state in ratios)){
        ratios[state] = 0;
      }
      ratios[state]++;
    }
    var bars = document.getElementById('dashboard_indicator').getElementsByTagName('div');
    for(var i = 0; i < bars.length; i++){
      bars[i].style.width = "0%";
    }
    for(var type in ratios){
      document.getElementById(type).style.width = Math.floor(ratios[type] * 100 / parseFloat(user.questions.length))+'%';
    }
    update_ui();
    poll_for_instances();
  },1000);
}

function log_cards(config){
  try{
    var cards = node.get_instances("card", true);
    var properties = ['timestamp', 'content', 'verbatim', 'is in reply to', 'is from', 'number of keystrokes', 'submit time', 'start time', 'latitude', 'longitude'];
    var unlogged_cards = [];
    for(var i = 0; i < cards.length; i++){
      if(config.logged_cards.indexOf(cards[i].name) == -1){
        var card_to_log = {};
        card_to_log.name = cards[i].name;
        card_to_log.type = cards[i].type.name;
        for(var j = 0; j < properties.length; j++){
          var prop = properties[j];
          if(cards[i].property(prop)){
            card_to_log[prop] = cards[i].property(prop).name || cards[i].property(prop);
          }
        }
        //console.log("LOG:"+card_to_log);
        unlogged_cards.push(card_to_log);
      }  
    }
    if(unlogged_cards.length == 0){
      setTimeout(function(){
         log_cards(config);
      }, 3000); 
      return;
    }  

    var xhr = new XMLHttpRequest();
    console.log('logging to',config.url);
    xhr.open("POST", config.url);
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        setTimeout(function(){
          for(var i = 0; i < unlogged_cards.length; i++){
            config.logged_cards.push(unlogged_cards[i].name);
          }
          log_cards(config);
        }, 8000);
      }
      else if(xhr.readyState == 4 && xhr.status != 200){
        setTimeout(function(){
          log_cards(config);
        }, 3000);
      }
    }
    console.log(unlogged_cards);
    xhr.send(JSON.stringify(unlogged_cards));
  }
  catch(err){
    console.log(err);
    setTimeout(function(){
      log_cards(config);
    }, 3000);
  }
}

function check_online(){
  var now = new Date().getTime();
  var last = node.agent.get_last_successful_request();
  var diff = now - last;
  if(diff < 5000){
    ui.info.online_status.style.backgroundColor = "green";
  }
  else{
    ui.info.online_status.style.backgroundColor = "rgb(200,200,200)";
  }
  setTimeout(function(){
    check_online();
  }, 1000);
}

var record_position = function(position){
  latest_longitude = position.coords.longitude;
  latest_latitude = position.coords.latitude;
}

window.onresize = function(event) {
  ui.info.cards.style.height = (window.innerHeight - 200)+'px'; 
  ui.info.cards.scrollTop = ui.info.cards.scrollHeight;
  document.getElementById('wrapper').style.height = window.innerHeight+'px';
}

window.onbeforeunload = function() { 
  //return "Quitting Sherlock may mean you can't resume from where you left off."; 
  return "Gallai gadael Sherlock golygu na allwch chi ailddechrau o ble rydych yn gadael."; 
};

window.onload = function(){
  initialize_ui();
  bind_listeners();
  ui.overlays.moira.style.display = "none";
  ui.overlays.dashboard.style.display = "none";
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(record_position);
  }
  ui.inputs.text.focus();
  ui.info.cards.style.height = (window.innerHeight - 200)+'px'; 
  document.getElementById('wrapper').style.height = window.innerHeight+'px';
};
