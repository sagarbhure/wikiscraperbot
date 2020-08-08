class usermsg{
    constructor(){
        this.input = "";
    }
}

var usermsgvar = new usermsg();

$(document).ready(function() {
    var chatwindowtogglestate = false;
    var firstchatwindowopen = false;
    // mode.setmode("1");

    // EVENT HANDLER
    $("#usersendmsgbtn").on("usermsgsent", async (event) => {
        // var response = await ajaxcalls.callchatbotpy(usermsgvar.searchword, usermsgvar.text);
        // botsendmsg(response);
        botreplyingmode(true);
        mode.handlemode(usermsgvar.input, false).then(() => {
            botreplyingmode(false);
        });
    });

    var firstgreetings = ["Hi, what would you like to know about today?", "Hey, ready for some knowledge?", "*nods*", "Hi there, what u up for?", "Ask me anything?", "I am glad, you are asking me something!"];
    var mode1greetings = ["Enter anything you would like to know about...(keywords only)", "Enter any keywords for anything you would like to know", "Enter keywords for any (intresting) topic!"];
    var mode2greetings = ["Enter the serial no of any of the suggestions given...", "Select and enter the serial no. of any of the given suggestions...", "Choose any one of the suggestions and enter its serial no..."];
    var mode3greetings = ["Ask me questions on the loaded data...", "You now free to ask me any questions on the loaded data", "Go ahead, ask away anything now"];

    function generatemode3extraresponse(mode3searchquery){
        var mode3newgreetings = ["Ask me questions on "+mode3searchquery+"...", "You now free to ask me any questions on "+mode3searchquery+"", "Go ahead, ask away anything about "+mode3searchquery+" now"];
        var newgreeting = mode3newgreetings[Math.floor(Math.random() * 3)];
        return newgreeting;
    };

    $("#chatinitiatebtnactual").click(() => {
        if(firstchatwindowopen == false){ 
            // botsendmsg(firstgreetings[Math.floor(Math.random() * 6)]);
            firstchatwindowopen = true;
        }else{  
            //// SEND MODE GREETING
            // mode.initializemode();
        }
        togglechatwindow();
        scrollchatwindowtobottom();
    }); 

    $("#minimizechatbtn").click(() => {
        togglechatwindow();
    });

    $("#usersendmsgbtn").click(() => {
        if($("#usermsginput").val() != ""){
            botreplyingmode(true);
            sendmsg("user", $("#usermsginput").val());
            usermsgvar.input = $("#usermsginput").val();
            $("#usermsginput").val("");
            $("#usersendmsgbtn").trigger('usermsgsent');
        }else{
            alert("Empty message can't be sent!");
        }
    });

    function botreplyingmode(mode){
        if(mode == true){
            $("#usersendmsgbtn").prop('disabled', true);
            $("#usermsginput").prop('disabled', true);
            $("#typingstatuslabel").css('display', 'block');
        }else{
            $("#usersendmsgbtn").prop('disabled', false);
            $("#usermsginput").prop('disabled', false);
            $("#typingstatuslabel").css('display', 'none');
        }
    }

    function togglechatwindow(){
        if(chatwindowtogglestate == false){
            chatwindowtogglestate = true;
            $("#chatwindow").css({'display': 'block'});
            $("#chatinitiatebtn").css({'display': 'none'});
            $("#chatwindow").css({'animation-name': 'chatwindowpopupanim'});
            setTimeout(() => {
                $("#chatwindow").css({'animation-name': ''});
            }, 1000);

        }else{
            chatwindowtogglestate = false;
            $("#chatwindow").css({'animation-name': 'chatwindowpopdownanim'});
            setTimeout(() => {
                $("#chatwindow").css({'animation-name': ''});
                $("#chatwindow").css({'display': 'none'});
                $("#chatinitiatebtn").css({'display': 'block'});
            }, 1000);
        }
    };

    var ajaxcalls = {
        callchatbotpy: (searchword) => {
            return new Promise(resolve => {
                $.ajax({ 
                    url: '/getresponsechatbot',
                    type: 'POST',
                    cache: false, 
                    data: { searchword: searchword }, 
                    success: function(data){
                        resolve(data);
                    }
                    , error: function(jqXHR, textStatus, err){
                        resolve(err.message);
                    }
                })
            })
        },
        callsuggestionpy: (searchword) => {
            return new Promise((resolve, reject) => {
                $.ajax({ 
                    url: '/getsuggestion',
                    type: 'POST',
                    cache: false, 
                    data: { searchword: searchword }, 
                    success: function(data){
                        resolve(data);
                    }
                    , error: function(jqXHR, textStatus, err){
                        reject(err.message);
                    }
                })
            })
        },
        callpagecontentpy: (searchword) => {
            return new Promise((resolve, reject) => {
                $.ajax({ 
                    url: '/getpagecontent',
                    type: 'POST',
                    cache: false, 
                    data: { searchword: searchword }, 
                    success: function(data){
                        resolve(data);
                    }
                    , error: function(jqXHR, textStatus, err){
                        reject(err.message);
                    }
                })
            })
        },
        unloaddata: (searchword) => {
            return new Promise()
        } 
    }

    function botsendmsg(msg){
        sendmsg("bot", msg);
    }

    function sendmsg(mode, msgcontent){
        var msghtml;
        if(mode == "bot"){
            msghtml = "<div class='botmsgspan'> <div class='botmsg'> <div class='msgcontents'> <h6>"+msgcontent+"</h6> </div> </div> </div>";
        }else {
            msghtml = "<div class='usermsgspan'> <div class='usermsg'> <div class='msgcontents'> <h6>"+msgcontent+"</h6> </div> </div> </div>";
        }
        $("#chatwindowmsgscontainer").append(msghtml);
        scrollchatwindowtobottom();
    };

    function scrollchatwindowtobottom(){
        $("#chatwindowcontents").scrollTop($("#chatwindowmsgscontainer").prop("scrollHeight"));
    }

    var mode = {
        mode: 1,              
        mode1searchquery: "",
        mode2suggestionobj: {},
        mode3searchpagecontent: "",
        mode3searchquery: "",
    }

    mode.handlemode = async (handleinfo, commandmode) => {    // HANDLE MODE
            
        /// ADD ABILITY TO HANDLE COMMANDS
        /// COMMANDS LISRR -- 
        // $$ unloaddata                              ///// MODE 3
        // $$ unloaddatabacktolist       //// MODE 3
        // $$ loadfromurl-<url>                       //// MODE 2 / MODE 1  

        return new Promise(async (resolve) => {
            var modetoset = 0;
            if(this.mode == 1){
                if(modefuncs.checkforcommand(handleinfo).bool){
                    modefuncs.handlecommands(modefuncs.checkforcommand(handleinfo)).then(() => {
                        resolve();
                    }, (error) => {
                        resolve();
                    });
                   
                }else{
                    this.mode1searchquery = handleinfo;
                    await ajaxcalls.callsuggestionpy(this.mode1searchquery).then((suggestionjsonstr) => {
                        mode.mode2suggestionobj = JSON.parse(suggestionjsonstr);
                        modetoset = 2;                           ////////// THIS WAS TRIGGERING THE MODE 2 EVENT HANDLER
                        resolve();
                    }, (error) => {
                        botsendmsg(error);
                        modetoset = 1; 
                        resolve();
                    });
                }                
            }
            if(this.mode == 2){          
                if(modefuncs.checkforcommand(handleinfo).bool){
                    modefuncs.handlecommands(modefuncs.checkforcommand(handleinfo)).then(() => {
                        resolve();
                    }, (error) => {
                        resolve();
                    });
                }
                else{
                    if(commandmode){
                        this.mode3searchquery = handleinfo;
                        await ajaxcalls.callpagecontentpy(this.mode3searchquery).then((pagecontent) => {
                            // console.log(pagecontent);
                            this.mode3searchpagecontent = pagecontent;
                            modetoset = 3; 
                            resolve();
                        }, (error) => {
                            botsendmsg(error);
                            modetoset = 2; 
                            resolve();
                        })
                    }else{
                        if(!isNaN(handleinfo)){       //////  IF INPUT IS PARSABLE TO INT
                            if(parseInt(handleinfo) <=  Object.keys(mode.mode2suggestionobj).length-1){
                                this.mode3searchquery = mode.mode2suggestionobj[String(parseInt(handleinfo)-1)+'-reasult'];
                                await ajaxcalls.callpagecontentpy(this.mode3searchquery).then((pagecontent) => {
                                    this.mode3searchpagecontent = pagecontent;
                                    // console.log(this.mode3searchpagecontent);
                                    modetoset = 3; 
                                    resolve();
                                }, (error) => {
                                    botsendmsg(error);
                                    modetoset = 2; 
                                    resolve();
                                })
                            }else{
                                //// ENTERED NUMBER IS OVER LIMIT
                                botsendmsg("Serial number is over limit");
                                modetoset = 2; 
                                resolve();
                            }
                        }else{
                            //// ENTERED VALUE IS NOT A NUMBER
                            botsendmsg("Enter a serial number!");
                            modetoset = 2; 
                            resolve();
                        }
                    }
                }
            }
            if(this.mode == 3){
                if(modefuncs.checkforcommand(handleinfo).bool){
                    modefuncs.handlecommands(modefuncs.checkforcommand(handleinfo)).then(() => {
                        resolve();
                    }, (error) => {
                        resolve();
                    });
                }
                else{
                    await ajaxcalls.callchatbotpy(handleinfo).then((botmsg) => {
                        botsendmsg(botmsg);
                        modetoset = 3;
                        resolve();
                    }, (error) => {
                        botsendmsg(error);
                        modetoset = 3;
                        resolve();
                    })
                }
            }
            if(modetoset != 0){
                mode.setmode(modetoset);           ///////////       SETTING MODE HERE
            }
        });
    }

    mode.setmode = (modeinput) => {
        this.mode = modeinput;
        mode.initializemode();
    };


    /// INITIALIZE MODE
    mode.initializemode = () => {
        if(this.mode == 1){
            botsendmsg(mode1greetings[Math.floor(Math.random() * 3)]);
            this.mode1searchquery = "";
            this.mode2suggestion = [];
            this.mode3searchpagecontent = "";
            mode3searchquery = "";
        }
        if(this.mode == 2){
            mode.mode3searchpagecontent = "";
            if(mode.mode2suggestionobj.reasultlength != 0){
                botsendmsg(modefuncs.mode2suggestionhtmlgene());
                botsendmsg(mode2greetings[Math.floor(Math.random() * 3)]);
            }else{
                botsendmsg("No relevant topics found for your search query.");
                mode.setmode(1);
            }
        }
        if(this.mode == 3){
            console.log(this.mode3searchpagecontent); ///// CONSOLE.LOG
            // botsendmsg(generatemode3extraresponse(this.mode3searchquery));
            if(!this.mode3searchpagecontent.includes("No info found regarding the query.")){
                // botsendmsg(mode3greetings[Math.floor(Math.random() * 3)]);
                botsendmsg(generatemode3extraresponse(this.mode3searchquery));       
            }else{
                botsendmsg("I couldn't find enough usable information regarding your query.");
                mode.setmode(1);
            }
        }
    };

    mode.setmode("1");

    var modefuncs = {}

    modefuncs.mode2suggestionhtmlgene = () => {                 //////// WRITE THIS
        var obj = mode.mode2suggestionobj;
        var htmlstr = "";
        for(var i = 0; i < obj.reasultlength; i++){
            if(i == 0){
                htmlstr = htmlstr + '(' + String(i+1) + ')' + " " + obj[String(i)+'-reasult'];
            }else{
                htmlstr = htmlstr + "<br>" + '(' + String(i+1) + ')' + " " + obj[String(i)+'-reasult'];
            }
        }
        return htmlstr;
    };

    modefuncs.checkforcommand = (handleinfo) => {
        if(handleinfo.includes('$$')){
            if(this.mode == 2 && handleinfo == '$$ unloaddata'){
                return { bool: true, correct: true, command: "unloaddata"};
            }
            else if(this.mode == 1 || this.mode == 2){
                if(handleinfo.startsWith('$$ loadfromurl-')){
                    var commandarr = handleinfo.split('-');
                    if(commandarr[1] != "" && !commandarr[1].includes('en.wikipedia.org')){      
                        return { bool: true, correct: true, command: "loadfromurl", url: commandarr[1] };
                    }else{
                        return { bool: true, correct: false };
                    }
                }else{
                    return { bool: true, correct: false };
                }
            }
            else if(this.mode == 3){
                if(handleinfo == '$$ unloaddata'){
                    return { bool: true, correct: true, command: "unloaddata"};
                }else if(handleinfo == '$$ unloaddatabacktolist'){
                    return { bool: true, correct: true, command: "unloaddatabacktolist" };
                }else{
                    return { bool: true, correct: false };
                }
            }
        }else{
            return { bool: false, correct: true };
        }
    };

    modefuncs.handlecommands = async (returnedobj) => {         //////// RETURNED OBJ IS UNDEFINED
        return new Promise(async (resolve, reject) => {
            if(returnedobj.correct){
                if(returnedobj.command == "loadfromurl"){
                    this.mode3searchquery = returnedobj.url;
                    await ajaxcalls.callpagecontentpy(this.mode3searchquery).then((pagecontent) => {
                        // console.log(pagecontent);   
                        this.mode3searchpagecontent = pagecontent;
                        mode.setmode(3);
                        resolve();
                    }, (error) => {
                        botsendmsg(error);
                        mode.setmode(1);
                        reject();
                    })

                    await ajaxcalls.callpagecontentpy(this.mode3searchquery).then((pagecontent) => {
                        // console.log(pagecontent);
                        this.mode3searchpagecontent = pagecontent;
                        modetoset = 3; 
                        resolve();
                    }, (error) => {
                        botsendmsg(error);
                        modetoset = 2; 
                        resolve();
                    })
                    // mode.setmode(2);
                    // await mode.handlemode(returnedobj.url, true);
                }
                if(returnedobj.command == "unloaddata"){
                    botsendmsg("[DATA UNLOADED]");
                    mode.setmode(1);
                    resolve();
                }
                if(returnedobj.command == "unloaddatabacktolist"){
                    botsendmsg("[DATA UNLOADED]");  
                    mode.setmode(2);
                    resolve();
                }
            }else{
                botsendmsg("The entered command is incorrect or cannot be used now");
                mode.setmode(this.mode);
                resolve();
            }
        });
    }
});

