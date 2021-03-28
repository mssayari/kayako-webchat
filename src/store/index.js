//import Vue from 'vue'
import {createStore} from "vuex";
import axios from 'axios'
import custom from "../custom";
import router from "../router/index";
import * as rax from 'retry-axios';


const devUrl = 'http://kayakosnap.ltd/winapp/index.php?';

const client = axios.create({
    baseURL: window.location.hostname !== "localhost" ? window.location.origin + "/winapp/index.php?" : devUrl,
    withCredentials: true,
});


client.defaults.raxConfig = {
    instance: client,
    retry: 3,
    noResponseRetries: 5,
    retryDelay: 500,
    httpMethodsToRetry: ['GET', 'OPTIONS', 'POST'],
    shouldResetTimeout: false,
    statusCodesToRetry: [[100, 199], [429, 429], [500, 599]],
    onRetryAttempt: (err) => {
        const cfg = rax.getConfig(err);
        return new Promise(resolve => setTimeout(resolve, cfg.retry * 600));
    }
};
rax.attach(client);


export default createStore({
    state: {
        config: JSON.parse(localStorage.getItem("config")) || null,
        currentUser: JSON.parse(localStorage.getItem("current_user")) || null,
        staffList: [],
        pendingChats: [],
        activeChats: JSON.parse(localStorage.getItem("chats")) || [],
        queue: [],
        canned: JSON.parse(localStorage.getItem("canned")) || {name: 'canned', children: []},
        departments: JSON.parse(localStorage.getItem("departments")) || [],
        teams: JSON.parse(localStorage.getItem("teams")) || [],
        lastRequest: Math.round(new Date().getTime() / 1000),
        lastVisitor: Math.round(new Date().getTime() / 1000),
    },
    getters: {
        loggedIn(state) {
            return state.config !== null;
        },
        canned(state) {
            return state.canned;
        },
        /**
         * @param state
         * @returns {
         *      companyName,
         *      displayTimestamps,
         *      permissions: {
         *          canObserve,
         *      },
         *      sessionId,
         *      variables: {
         *          max_upload_size,
         *      },
         * }
         */
        config(state) {
            return state.config;
        },
        /**
         *
         * @param state
         * @returns {
         *      fullName,
         *      email,
         *      greeting,
         *      mobileNumber,
         *      sessionId,
         *      status,
         * }
         */
        currentUser(state) {
            return state.currentUser;
        },
        getWorkplace(state) {
            return state.workplace;
        },
        /**
         *
         * @param state
         * @returns {[
         *     {
         *         type,
         *         status,
         *         chatObjectId,
         *         userFullName,
         *         userEmail,
         *         requestStaffId,
         *         subject,
         *         departmentTitle,
         *         chatSessionId,
         *         transferStatus,
         *         transferFromId,
         *         transferToId,
         *         chatType,
         *         duration,
         *         waitTime,
         *         creationDate,
         *         initialChatType,
         *     }
         * ]}
         */
        getQueue(state) {
            return state.queue;
        },
        /**
         * @param state
         * @returns {[
         *     {
         *         chatObjectId,
         *         userFullName,
         *         userEmail,
         *         subject,
         *         departmentTitle,
         *         chatSessionId,
         *         transferStatus,
         *         transferFromId,
         *         transferToId,
         *     }
         * ]}
         */
        getPendingChats(state) {
            return state.pendingChats;
        },

        /**
         * @param state
         * @returns {[
         *     {
         *         status,
         *         chatObjectId,
         *         chatSessionId,
         *         userFullName,
         *         userEmail,
         *         chatType,
         *         departmentId,
         *         departmentTitle,
         *         staffId,
         *         subject,
         *         duration,
         *         newMessagesCount,
         *         playSound,
         *         messages: [{
         *         		chatObjectId,
         *				userId,
         *	         	from,
         * 	        	fullName,
         * 	        	type,
         * 	        	base64,
         * 	        	timestamp,
         * 	        	content
         *         }]
         *     }
         * ]}
         */
        getActiveChats(state) {
            return state.activeChats;
        },
        /**
         *
         * @param state
         * @returns <array>{[
         *		isAdmin,
         *		staffGroupId,
         *		title,
         *		staff{
         *  		[{
         *      		staffId,
         *      		fullName,
         *      		username,
         *      		email,
         *      		departments,
         *      		lastActivity,
         *      		lastVisit,
         *      		sessionId,
         *      		status,
         *  		}]
         * 		}
         * 	]}
         */
        getStaffList(state) {
            return state.staffList;
        },

        getConfirmationsToSendByChatObjectId: (state) => (chatObjectId) => {
            var confirmations = [];
            if (state.activeChats.length) {
                let obj = state.activeChats.find(x => x.chatObjectId === chatObjectId);
                let index = state.activeChats.indexOf(obj);
                if (index > -1) {
                    for (let guid of obj.confirmations) {
                        confirmations.push({
                            _attributes: {
                                guid: guid,
                                status: "1",
                            },
                        });
                    }

                    //remove confirations
                    state.activeChats[index].confirmations = [];
                }
            }
            return confirmations;
        },
        getSelectedChatObject: (state) => (chatObjectId) => {
            if (state.activeChats.length) {
                let obj = state.activeChats.find(x => x.chatObjectId === chatObjectId);
                let index = state.activeChats.indexOf(obj);
                if (index > -1) {
                    return obj;
                }
            }
        },
    },
    mutations: {
        resetNewMessageCount(state, chatObjectId) {
            if (state.activeChats.length !== 0) {
                let messageObj = state.activeChats.find(x => x.chatObjectId === chatObjectId);
                let messageIndex = state.activeChats.indexOf(messageObj);
                if (messageIndex > -1) {
                    state.activeChats[messageIndex].newMessagesCount = 0;
                    state.activeChats[messageIndex].playSound = false;
                }
            }
        },
        turnOffMessageSound(state, chatObjectId) {
            if (state.activeChats.length !== 0) {
                let messageObj = state.activeChats.find(x => x.chatObjectId === chatObjectId);
                let messageIndex = state.activeChats.indexOf(messageObj);
                if (messageIndex > -1) {
                    state.activeChats[messageIndex].playSound = false;
                }
            }
        },
        updateCurrentUserStatus(state, status) {
            var currentUser = state.currentUser;
            currentUser.status = status;

            localStorage.setItem("current_user", JSON.stringify(currentUser));
            state.currentUser = currentUser;

        },
        updateConfig(state, responseData) {
            var currentUser = null;
            var config = null;

            //clean and store config
            config = {
                companyName: responseData.companyname._cdata,
                displayTimestamps: responseData.displaytimestamps._cdata,
                permissions: {
                    canObserve: responseData.permissions.can_observe._cdata,
                },
                sessionId: responseData.sessionid._cdata,
                variables: {
                    max_upload_size: responseData.variables.max_upload_size._cdata,
                },
            };

            //store currentUser information
            currentUser = {
                fullName: responseData.staff.fullname._cdata,
                email: responseData.staff.email._cdata,
                greeting: responseData.staff.greeting._cdata,
                mobileNumber: responseData.staff.mobilenumber._cdata,
                sessionId: responseData.staffsessionid._cdata,
                status: responseData.status._cdata,
            };

            //departments
            state.departments = custom.parseDepartmentsList(responseData.departments.department, []);

            //teams
            let teams = [];
            for (let staffgroup of responseData.staffgroups.staffgroup) {
                teams.push(
                    {
                        id: staffgroup._attributes.id,
                        title: staffgroup._cdata
                    }
                );
            }

            state.teams = teams;

            // Canned messages
            if (!state.canned) {
                state.canned = {name: 'canned', children: []};
            }
            state.canned.children = custom.scanCannedMessages(responseData.canned.category, []);

            localStorage.removeItem("chats");
            localStorage.setItem("config", JSON.stringify(config));
            localStorage.setItem("current_user", JSON.stringify(currentUser));
            localStorage.setItem("canned", JSON.stringify(state.canned));
            localStorage.setItem("teams", JSON.stringify(state.teams));
            localStorage.setItem("departments", JSON.stringify(state.departments));
            state.config = config;
            state.currentUser = currentUser;
        },
        logout(state) {
            state.config = null;
            state.staffList = [];
            state.canned = null;
            state.activeChats = [];
        },
        updateStaffList(state, staffList) {
            if (Array.isArray(staffList.staffgroup)) {
                for (let staffgroup of staffList.staffgroup) {
                    let staffObj = state.staffList.find(x => x.staffGroupId === staffgroup._attributes.staffgroupid);
                    let staffIndex = state.staffList.indexOf(staffObj);
                    if (staffIndex > -1) {
                        state.staffList[staffIndex].isAdmin = staffgroup._attributes.isadmin
                        state.staffList[staffIndex].title = staffgroup._attributes.title
                        state.staffList[staffIndex].staff = custom.parseStaffsFromGroup(staffgroup)
                    } else {
                        state.staffList.push({
                            isAdmin: staffgroup._attributes.isadmin,
                            staffGroupId: staffgroup._attributes.staffgroupid,
                            title: staffgroup._attributes.title,
                            display: true,
                            staff: custom.parseStaffsFromGroup(staffgroup),
                        });
                    }
                }
            } else {
                let staffObj = state.staffList.find(x => x.staffGroupId === staffList.staffgroup._attributes.staffgroupid);
                let staffIndex = state.staffList.indexOf(staffObj);
                if (staffIndex > -1) {
                    state.staffList[staffIndex].isAdmin = staffList.staffgroup._attributes.isadmin
                    state.staffList[staffIndex].title = staffList.staffgroup._attributes.title
                    state.staffList[staffIndex].staff = custom.parseStaffsFromGroup(staffList.staffgroup)
                } else {
                    state.staffList.push({
                        isAdmin: staffList.staffgroup._attributes.isadmin,
                        staffGroupId: staffList.staffgroup._attributes.staffgroupid,
                        title: staffList.staffgroup._attributes.title,
                        display: true,
                        staff: custom.parseStaffsFromGroup(staffList.staffgroup),
                    });
                }
            }
        },
        accept(state, obj) {
            if (obj === "undefined" || obj === undefined) {
                return;
            }
            let activeChatObj = state.activeChats.find(x => x.chatObjectId === obj.chatObjectId);
            let activeChatIndex = state.activeChats.indexOf(activeChatObj);

            let InitMessage = {
                chatObjectId: obj.chatObjectId,
                userId: obj.userId,
                from: 'user',
                fullName: obj.userFullName,
                type: 'text',
                base64: 1,
                timestamp: Math.round(new Date().getTime() / 1000),
                content: obj.subject,
            }

            if (activeChatIndex === -1) {
                state.activeChats.push({
                    chatObjectId: obj.chatObjectId,
                    userFullName: obj.userFullName,
                    userEmail: obj.userEmail,
                    subject: obj.subject,
                    departmentTitle: obj.departmentTitle,
                    chatSessionId: obj.chatSessionId,
                    transferStatus: obj.transferStatus,
                    transferFromId: obj.transferFromId,
                    transferToId: obj.transferToId,
                    messages: [InitMessage],
                    message: '',
                    warning: false,
                    confirmations: [],
                    newMessagesCount: 0,
                    playSound: false,
                    active: true,
                });
            } else {
                state.activeChats[activeChatIndex].active = true;
            }
        },
        updatePendingChats(state, pendingChats) {
            var finalList = [];
            if (!pendingChats.chat) {
                state.pendingChats = [];
                return;
            }

            if (Array.isArray(pendingChats.chat)) {
                for (let item of pendingChats.chat) {
                    finalList.push({
                        chatObjectId: item.chatobjectid._cdata,
                        userFullName: item.userfullname._cdata,
                        userEmail: item.useremail._cdata,
                        userId: item.userid._cdata,
                        subject: item.subject._cdata,
                        departmentTitle: item.departmenttitle._cdata,
                        chatSessionId: item.chatsessionid._cdata,
                        transferStatus: item.transferstatus._cdata,
                        transferFromId: item.transferfromid._cdata,
                        transferToId: item.transfertoid._cdata,
                    });
                }
            } else {
                finalList.push({
                    chatObjectId: pendingChats.chat.chatobjectid._cdata,
                    userFullName: pendingChats.chat.userfullname._cdata,
                    userEmail: pendingChats.chat.useremail._cdata,
                    userId: pendingChats.chat.userid._cdata,
                    subject: pendingChats.chat.subject._cdata,
                    departmentTitle: pendingChats.chat.departmenttitle._cdata,
                    chatSessionId: pendingChats.chat.chatsessionid._cdata,
                    transferStatus: pendingChats.chat.transferstatus._cdata,
                    transferFromId: pendingChats.chat.transferfromid._cdata,
                    transferToId: pendingChats.chat.transfertoid._cdata,
                });
            }

            state.pendingChats = finalList;
        },
        /**
         * @todo check type codes meaning
         * @todo check status codes meaning
         * @todo check chatType meaning
         * @todo check initialChatType meaning
         * @todo archive chat if it's gone
         */
        /*
        status : {1:in chat,0: waiting (new request)}
         */
        updateQueue(state, queue) {
            var queuelist = [];

            if (queue.chat) {
                //var new_item = {};
                if (Array.isArray(queue.chat)) {
                    for (let item of queue.chat) {

                        let activeChatObj = state.activeChats.find(x => x.chatObjectId === item.chatobjectid._cdata);
                        let activeChatIndex = state.activeChats.indexOf(activeChatObj);

                        if (activeChatIndex !== -1) {
                            state.activeChats[activeChatIndex].type = item._attributes.type;
                            state.activeChats[activeChatIndex].status = item._attributes.status;
                            state.activeChats[activeChatIndex].requestStaffId = item.requeststaffid._cdata;
                            state.activeChats[activeChatIndex].staffid = item.staffid._cdata;
                            state.activeChats[activeChatIndex].chatType = item.chattype._cdata;
                            state.activeChats[activeChatIndex].duration = item.duration._cdata;
                            state.activeChats[activeChatIndex].waitTime = item.waittime._cdata;
                            state.activeChats[activeChatIndex].creationDate = item.creationdate._cdata;
                            state.activeChats[activeChatIndex].initialChatType = item.initialchattype._cdata;

                            if (item._attributes.status > 1) {
                                state.activeChats[activeChatIndex].active = false;
                            } else {
                                state.activeChats[activeChatIndex].active = true;
                            }
                        }
                    }
                } else {
                    let activeChatObj = state.activeChats.find(x => x.chatObjectId === queue.chat.chatobjectid._cdata);
                    let activeChatIndex = state.activeChats.indexOf(activeChatObj);

                    if (activeChatIndex !== -1) {
                        state.activeChats[activeChatIndex].type = queue.chat._attributes.type;
                        state.activeChats[activeChatIndex].status = queue.chat._attributes.status;
                        state.activeChats[activeChatIndex].requestStaffId = queue.chat.requeststaffid._cdata;
                        state.activeChats[activeChatIndex].staffid = queue.chat.staffid._cdata;
                        state.activeChats[activeChatIndex].chatType = queue.chat.chattype._cdata;
                        state.activeChats[activeChatIndex].duration = queue.chat.duration._cdata;
                        state.activeChats[activeChatIndex].waitTime = queue.chat.waittime._cdata;
                        state.activeChats[activeChatIndex].creationDate = queue.chat.creationdate._cdata;
                        state.activeChats[activeChatIndex].initialChatType = queue.chat.initialchattype._cdata;

                        if (queue.chat._attributes.status > 1) {
                            state.activeChats[activeChatIndex].active = false;
                        } else {
                            state.activeChats[activeChatIndex].active = true;
                        }
                    }
                }
            }
            state.queue = queuelist;
            this.commit('saveChatsInStore');
        },
        /**
         * @author Mojtaba Sayari
         * @param events
         * @todo manage notifications and typing ....
         * @todo check server confirmations (not important in this phase)
         */
        parseEvents(state, events) {
            //var guids = [];

            if (typeof events === 'undefined') {
                return;
            }

            if (Array.isArray(events.chat)) {
                for (let chat of events.chat) {
                    let newmessages = [];
                    let guids = [];
                    if (typeof chat.message !== 'undefined') {
                        if (Array.isArray(chat.message)) {
                            for (let message of chat.message) {
                                newmessages.push({
                                    chatObjectId: chat._attributes.chatobjectid,
                                    userId: chat._attributes.userid,
                                    from: message._attributes.from,
                                    fullName: message._attributes.fullname,
                                    type: message._attributes.type,
                                    base64: message._attributes.base64,
                                    timestamp: message._attributes.timestamp ? message._attributes.timestamp : Math.round(new Date().getTime() / 1000),
                                    content: message._attributes.base64 == "1" ? custom.base64Decode(message._cdata) : message._cdata,
                                });
                                guids.push(message._attributes.guid);
                            }
                        } else {
                            newmessages.push({
                                chatObjectId: chat._attributes.chatobjectid,
                                userId: chat._attributes.userid,
                                from: chat.message._attributes.from,
                                fullName: chat.message._attributes.fullname,
                                type: chat.message._attributes.type,
                                base64: chat.message._attributes.base64,
                                timestamp: chat.message._attributes.timestamp ? chat.message._attributes.timestamp : Math.round(new Date().getTime() / 1000),
                                content: chat.message._attributes.base64 == "1" ? custom.base64Decode(chat.message._cdata) : chat.message._cdata,
                            });
                            guids.push(chat.message._attributes.guid);
                        }

                        //Append To ActiveChants
                        let activeChatObj = state.activeChats.find(x => x.chatObjectId === chat._attributes.chatobjectid);
                        let activeChatIndex = state.activeChats.indexOf(activeChatObj);

                        if (activeChatIndex > -1) {
                            state.activeChats[activeChatIndex].newMessagesCount += newmessages.length;
                            state.activeChats[activeChatIndex].resetNewMessageCount = true;
                            state.activeChats[activeChatIndex].playSound = true;

                            for (let nmsitem of newmessages) {
                                state.activeChats[activeChatIndex].messages.push(nmsitem)
                            }
                            if (newmessages.length) {
                                state.activeChats[activeChatIndex].warning = false;
                            }
                        }
                    }


                    let activeChatObj = state.activeChats.find(x => x.chatObjectId === chat._attributes.chatobjectid);
                    let activeChatIndex = state.activeChats.indexOf(activeChatObj);

                    if (activeChatIndex > -1 && state.activeChats[activeChatIndex].active) {
                        // get confirmations
                        if (typeof chat.roster !== 'undefined') {
                            //is have multiple message ?
                            if (Array.isArray(chat.roster)) {

                                for (let roster of chat.roster) {
                                    guids.push(roster._attributes.guid)
                                }
                            } else {
                                guids.push(chat.roster._attributes.guid)
                            }
                        }
                    }

                    //catch warnings
                    if (typeof chat.warning !== 'undefined' && activeChatIndex > -1) {

                        state.activeChats[activeChatIndex].warning = true;

                        state.activeChats[activeChatIndex].messages.push({
                            chatObjectId: chat._attributes.chatobjectid,
                            userId: chat._attributes.userid,
                            from: 'system',
                            fullName: 'سیستم',
                            type: chat.warning._attributes.type,
                            base64: 0,
                            timestamp: Math.round(new Date().getTime() / 1000),
                            content: chat.warning._attributes.message,
                        });

                        guids.push(chat.warning._attributes.guid)
                    }

                    if (typeof chat.pounce !== 'undefined' && activeChatIndex > -1) {

                        if (Array.isArray(chat.pounce)) {
                            for (let pounce of chat.pounce) {
                                let content_static = '';
                                if (pounce._attributes.type == 'leave') {
                                    content_static = ' گفتگو را ترک کرد. ';
                                } else if (pounce._attributes.type == 'enter') {
                                    content_static = ' به گفتگو پیوست. ';
                                }

                                state.activeChats[activeChatIndex].messages.push({
                                    chatObjectId: chat._attributes.chatobjectid,
                                    userId: chat._attributes.userid,
                                    from: pounce._attributes.from,
                                    fullName: pounce._attributes.fullname,
                                    type: pounce._attributes.type,
                                    base64: 0,
                                    timestamp: pounce._attributes.timestamp ? pounce.message._attributes.timestamp : Math.round(new Date().getTime() / 1000),
                                    content: pounce._attributes.fullname + content_static,
                                });
                                guids.push(pounce._attributes.guid);
                            }

                        } else {

                            let content_static = '';
                            if (chat.pounce._attributes.type == 'leave') {
                                content_static = ' گفتگو را ترک کرد. ';
                            } else if (chat.pounce._attributes.type == 'enter') {
                                content_static = ' به گفتگو پیوست. ';
                            }

                            state.activeChats[activeChatIndex].messages.push({
                                chatObjectId: chat._attributes.chatobjectid,
                                userId: chat._attributes.userid,
                                from: chat.pounce._attributes.from,
                                fullName: chat.pounce._attributes.fullname,
                                type: chat.pounce._attributes.type,
                                base64: 0,
                                timestamp: chat.pounce._attributes.timestamp ? chat.pounce._attributes.timestamp : Math.round(new Date().getTime() / 1000),
                                content: chat.pounce._attributes.fullname + content_static,
                            });
                            guids.push(chat.pounce._attributes.guid);
                        }

                    }


                    if (activeChatIndex > -1) {
                        for (let nguid of guids) {
                            if (state.activeChats[activeChatIndex].confirmations.indexOf(nguid) === -1) {
                                state.activeChats[activeChatIndex].confirmations.push(nguid);
                            }
                        }
                    }

                }
            } else {
                let newmessages = [];
                let guids = [];


                //get messages
                if (typeof events !== 'undefined' && typeof events.chat !== 'undefined' && typeof events.chat.message !== 'undefined') {
                    if (Array.isArray(events.chat.message)) {
                        for (let message of events.chat.message) {
                            newmessages.push({
                                chatObjectId: events.chat._attributes.chatobjectid,
                                userId: events.chat._attributes.userid,
                                from: message._attributes.from,
                                fullName: message._attributes.fullname,
                                type: message._attributes.type,
                                base64: message._attributes.base64,
                                timestamp: message._attributes.timestamp ? message._attributes.timestamp : Math.round(new Date().getTime() / 1000),
                                content: message._attributes.base64 == "1" ? custom.base64Decode(message._cdata) : message._cdata,
                            });
                            guids.push(message._attributes.guid);
                        }
                    } else {
                        newmessages.push({
                            chatObjectId: events.chat._attributes.chatobjectid,
                            userId: events.chat._attributes.userid,
                            from: events.chat.message._attributes.from,
                            fullName: events.chat.message._attributes.fullname,
                            type: events.chat.message._attributes.type,
                            base64: events.chat.message._attributes.base64,
                            timestamp: events.chat.message._attributes.timestamp ? events.chat.message._attributes.timestamp : Math.round(new Date().getTime() / 1000),
                            content: events.chat.message._attributes.base64 == "1" ? custom.base64Decode(events.chat.message._cdata) : events.chat.message._cdata,
                        });
                        guids.push(events.chat.message._attributes.guid);
                    }

                    //Append To ActiveChants
                    let activeChatObj = state.activeChats.find(x => x.chatObjectId === events.chat._attributes.chatobjectid);
                    let activeChatIndex = state.activeChats.indexOf(activeChatObj);

                    if (activeChatIndex > -1) {
                        state.activeChats[activeChatIndex].newMessagesCount += newmessages.length;
                        state.activeChats[activeChatIndex].playSound = true;
                        for (let nmsitem of newmessages) {
                            state.activeChats[activeChatIndex].messages.push(nmsitem)
                        }

                        if (newmessages.length) {
                            state.activeChats[activeChatIndex].warning = false;
                        }
                    }
                }

                if (typeof events.chat === 'undefined') {
                    return
                }

                let activeChatObj = state.activeChats.find(x => x.chatObjectId === events.chat._attributes.chatobjectid);
                let activeChatIndex = state.activeChats.indexOf(activeChatObj);

                if (activeChatIndex > -1 && state.activeChats[activeChatIndex].active) {
                    // get confirmations
                    if (typeof events.chat !== 'undefined' && typeof events.chat.roster !== 'undefined') {
                        //is have multiple message ?
                        if (Array.isArray(events.chat.roster)) {

                            for (let roster of events.chat.roster) {
                                guids.push(roster._attributes.guid)
                            }
                        } else {
                            guids.push(events.chat.roster._attributes.guid)
                        }
                    }
                }

                //catch warnings
                if (activeChatIndex > -1 && typeof events.chat !== 'undefined' && typeof events.chat.warning !== 'undefined') {

                    state.activeChats[activeChatIndex].warning = true;

                    state.activeChats[activeChatIndex].messages.push({
                        chatObjectId: events.chat._attributes.chatobjectid,
                        userId: events.chat._attributes.userid,
                        from: 'system',
                        fullName: 'سیستم',
                        type: events.chat.warning._attributes.type,
                        base64: 0,
                        timestamp: Math.round(new Date().getTime() / 1000),
                        content: events.chat.warning._attributes.message,
                    });

                    guids.push(events.chat.warning._attributes.guid)
                }

                if (activeChatIndex > -1 && typeof events.chat !== 'undefined' && typeof events.chat.pounce !== 'undefined') {

                    if (Array.isArray(events.chat.pounce)) {
                        for (let pounce of events.chat.pounce) {
                            let content_static = '';
                            if (pounce._attributes.type == 'leave') {
                                content_static = ' گفتگو را ترک کرد. ';
                            } else if (pounce._attributes.type == 'enter') {
                                content_static = ' به گفتگو پیوست. ';
                            }

                            state.activeChats[activeChatIndex].messages.push({
                                chatObjectId: events.chat._attributes.chatobjectid,
                                userId: events.chat._attributes.userid,
                                from: pounce._attributes.from,
                                fullName: pounce._attributes.fullname,
                                type: pounce._attributes.type,
                                base64: 0,
                                timestamp: pounce._attributes.timestamp ? pounce._attributes.timestamp : Math.round(new Date().getTime() / 1000),
                                content: pounce._attributes.fullname + content_static,
                            });
                            guids.push(pounce._attributes.guid);
                        }

                    } else {

                        let content_static = '';
                        if (events.chat.pounce._attributes.type == 'leave') {
                            content_static = ' گفتگو را ترک کرد. ';
                        } else if (events.chat.pounce._attributes.type == 'enter') {
                            content_static = ' به گفتگو پیوست. ';
                        }

                        state.activeChats[activeChatIndex].messages.push({
                            chatObjectId: events.chat._attributes.chatobjectid,
                            userId: events.chat._attributes.userid,
                            from: events.chat.pounce._attributes.from,
                            fullName: events.chat.pounce._attributes.fullname,
                            type: events.chat.pounce._attributes.type,
                            base64: 0,
                            timestamp: events.chat.pounce._attributes.timestamp ? events.chat.pounce._attributes.timestamp : Math.round(new Date().getTime() / 1000),
                            content: events.chat.pounce._attributes.fullname + content_static,
                        });
                        guids.push(events.chat.pounce._attributes.guid);
                    }


                }

                if (activeChatIndex > -1) {
                    for (let nguid of guids) {
                        if (state.activeChats[activeChatIndex].confirmations.indexOf(nguid) === -1) {
                            state.activeChats[activeChatIndex].confirmations.push(nguid);
                        }
                    }
                }
            }


            //save everything in browser storage
            this.commit('saveChatsInStore');
        },
        saveChatsInStore(state) {
            localStorage.setItem("chats", JSON.stringify(state.activeChats));
        },
        deleteCookie(name, path, domain) {
            document.cookie = name + "=" + (path ? ";path=" + path : "") + (domain ? ";domain=" + domain : "") + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
        },
        appendMessageToList(state, params) {
            let activeChatObject = state.activeChats.find(x => x.chatObjectId === params.chatObjectId);
            let activeChatIndex = state.activeChats.indexOf(activeChatObject);

            if (activeChatIndex > -1) {
                state.activeChats[activeChatIndex].messages.push({
                    base64: "1",
                    chatObjectId: params.chatObjectId,
                    content: params.message,
                    from: "staff",
                    fullName: state.currentUser.fullName,
                    timestamp: Math.round(new Date().getTime() / 1000),
                    type: "text",
                    userId: null,
                })
                state.activeChats[activeChatIndex].warning = false;
            }
        },
    },
    actions: {
        /**
         *
         * @param context
         * @param credentials <object> {username,password}
         * @returns {Promise<object>}
         *
         * result details
         * status<bool>: true/false
         * message<string>: only fills when status is false
         */
        login({commit}, credentials) {
            return new Promise((resolve, reject) => {
                client.post("/Core/Default/Login", custom.createRequest(credentials))
                    .then(resp => {
                        var result = custom.parseResponse(resp);
                        if (result.kayako_livechat.status._cdata === "1") {
                            commit("updateConfig", result.kayako_livechat);
                            resolve({status: true, message: ""});
                        } else {
                            reject({status: false, message: result.kayako_livechat.error._cdata});
                        }
                    })
                    .catch(err => {
                        reject({status: false, message: err.error._cdata});
                    })
            })
        }
        ,

        /**
         *
         * @param context
         * @returns {Promise<object>}
         *
         * result details
         * status<bool>: true/false
         * message<string>: only fills when status is false
         *
         */
        logout(context) {
            if (context.getters.loggedIn) {
                //leaveAll
                context.dispatch('leaveAll');

                var requestData = {
                    sessionid: context.state.config.sessionId,
                    status: context.state.currentUser.status,
                    randno: custom.generateChatRandomNumber(),
                };

                return new Promise((resolve, reject) => {
                    client
                        .post("/Core/Default/Logout", custom.createRequest(requestData))
                        .then((response) => {
                            var result = custom.parseResponse(response);
                            if (result.kayako_livechat.status._cdata === "1") {
                                localStorage.removeItem("SWIFT_sessionid50");
                                localStorage.removeItem("config");
                                localStorage.removeItem("canned");
                                localStorage.removeItem("chats");
                                context.commit("logout");
                                router.push({name: "Login"});
                                resolve({status: true, message: ""});
                            } else {
                                //localStorage.removeItem('SWIFT_sessionid50');
                                localStorage.removeItem("config");
                                localStorage.removeItem("canned");
                                context.commit("logout");
                                router.push({name: "Login"});
                                reject({status: false, message: response.toString()});
                            }
                        })
                        .catch((error) => {
                            reject({status: false, message: error.toString()});
                        });
                });
            }
        }
        ,
        /**
         *
         * @param context
         * @returns {Promise<object>}
         *
         * result details
         * status<bool>: true/false
         * message<string>: only fills when status is false
         */
        fetchVisitors(context) {
            let newTime = Math.round(new Date().getTime() / 1000);
            if (context.getters.loggedIn) {
                var requestData = {
                    sessionid: context.state.config.sessionId,
                    status: context.state.currentUser.status,
                    randno: custom.generateChatRandomNumber(),
                };
            }

            if (newTime - context.state.lastVisitor < 10) {
                return new Promise((resolve) => {
                    resolve("done");
                });
            }

            return new Promise((resolve, reject) => {
                if (context.getters.loggedIn) {
                    client
                        .post("/LiveChat/FetchVisitors", custom.createRequest(requestData))
                        .then((response) => {
                            var result = custom.parseResponse(response);
                            if(!result.kayako_livechat){
                                console.info('we are getting db or redis error!');
                            }else if (result.kayako_livechat.status && result.kayako_livechat.status._cdata === "-1") {
                                localStorage.removeItem("config");
                                context.commit("logout");
                                router.push({name: "Login"});
                                reject({status: false, message: "session timeout please login again"});
                            } else {
                                context.commit("updateStaffList", result.kayako_livechat.stafflist);
                                context.commit("updatePendingChats", result.kayako_livechat.pendingchats);
                                context.commit("updateQueue", result.kayako_livechat.queue);
                                context.state.lastVisitor = Math.round(new Date().getTime() / 1000);
                                resolve({status: true, message: ""});
                            }
                        })
                        .catch((error) => {
                            reject({status: false, message: error.toString()});
                        });
                } /* else {
                localStorage.removeItem('auth')
                if (router.currentRoute.name !== 'login') {
                    router.push({name: 'login'})
                }
            }*/
            });
        }
        ,
        /**
         *
         * @param context
         * @param chatObjectId
         * @param type [staffgroup,department,staff,skill]
         * @param date [transferObjectId]
         * @returns {Promise<unknown>}
         */
        transfer(context, param) {
            var xmldata = {
                events: {
                    chat: {
                        _attributes: {
                            chatobjectid: param.chatObjectId,
                        },
                        transfer: {
                            _attributes: {
                                guid: custom.generateGUID(),
                                type: param.type,
                                data: param.data,
                            },
                        },
                    },
                    confirmation: [],
                },
            };

            // append confirmations
            let confirmations = context.getters.getConfirmationsToSendByChatObjectId(param.chatObjectId);
            if (confirmations.length !== 0) {
                for (let c of confirmations) {
                    xmldata.events.confirmation.push(c);
                }
            }

            var requestData = {
                sessionid: context.state.config.sessionId,
                status: context.state.currentUser.status,
                chatobjectidlist: param.chatObjectId,
                randno: custom.generateChatRandomNumber(),
                xml: xmldata,
            };

            return new Promise((resolve, reject) => {
                client
                    .post("/LiveChat/events", custom.createRequest(requestData))
                    .then((response) => {
                        let result = custom.parseResponse(response);
                        context.state.lastRequest = Math.round(new Date().getTime() / 1000);
                        context.commit("parseEvents", result.events);
                        resolve('done');
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
        ,
        /**
         * @author Mojtaba Sayari
         *
         */
        accept(context, chatObjectId) {
            let chatobjectidlist = [];
            var xmldata = {
                events: {
                    chat: {
                        _attributes: {
                            chatobjectid: chatObjectId,
                        },
                        chataction: {
                            _attributes: {
                                guid: custom.generateGUID(),
                                type: "enter",
                            },
                        },
                    },
                    confirmation: [],
                },
            };

            chatobjectidlist.push(chatObjectId);

            // append confirmations
            for (let item of context.state.activeChats) {
                let confirmations = context.getters.getConfirmationsToSendByChatObjectId(item.chatObjectId);
                if (confirmations.length !== 0) {
                    for (let c of confirmations) {
                        xmldata.events.confirmation.push(c);
                    }
                    chatobjectidlist.push(item.chatObjectId);
                }
            }

            var requestData = {
                sessionid: context.state.config.sessionId,
                status: context.state.currentUser.status,
                chatobjectidlist: chatobjectidlist.join(','),
                randno: custom.generateChatRandomNumber(),
                xml: xmldata,
            };

            return new Promise((resolve, reject) => {
                client
                    .post("/LiveChat/events", custom.createRequest(requestData))
                    .then((response) => {
                        let result = custom.parseResponse(response);
                        context.state.lastRequest = Math.round(new Date().getTime() / 1000);
                        context.commit("parseEvents", result.events);
                        resolve('done');
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
        ,

        reject(context, chatObjectId) {
            let chatobjectidlist = [];
            var xmldata = {
                events: {
                    chat: {
                        _attributes: {
                            chatobjectid: chatObjectId,
                        },
                        chataction: {
                            _attributes: {
                                guid: custom.generateGUID(),
                                type: "refuse",
                            },
                        },
                    },
                    confirmation: [],
                },
            };

            chatobjectidlist.push(chatObjectId);

            // append confirmations
            for (let item of context.state.activeChats) {
                let confirmations = context.getters.getConfirmationsToSendByChatObjectId(item.chatObjectId);
                if (confirmations.length !== 0) {
                    for (let c of confirmations) {
                        xmldata.events.confirmation.push(c);
                    }
                    chatobjectidlist.push(item.chatObjectId);
                }
            }

            var requestData = {
                sessionid: context.state.config.sessionId,
                status: context.state.currentUser.status,
                chatobjectidlist: chatobjectidlist.join(','),
                randno: custom.generateChatRandomNumber(),
                xml: xmldata,
            };

            return new Promise((resolve, reject) => {
                client
                    .post("/LiveChat/events", custom.createRequest(requestData))
                    .then((response) => {
                        let result = custom.parseResponse(response);
                        context.state.lastRequest = Math.round(new Date().getTime() / 1000);
                        context.commit("parseEvents", result.events);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
        ,
        typing(context, chatObjectId) {
            let newTime = Math.round(new Date().getTime() / 1000);
            var xmldata = {
                events: {
                    chat: {
                        _attributes: {
                            chatobjectid: chatObjectId,
                        },
                        typing: {
                            _attributes: {
                                guid: custom.generateGUID(),
                                type: "1",
                            },
                        },
                    },
                    confirmation: [],
                }
            };

            if (newTime - context.state.lastRequest < 10) {
                return new Promise((resolve) => {
                    resolve("done");
                });
            }

            // append confirmations
            let confirmations = context.getters.getConfirmationsToSendByChatObjectId(chatObjectId);
            if (confirmations.length !== 0) {
                for (let c of confirmations) {
                    xmldata.events.confirmation.push(c);
                }
            }

            var requestData = {
                sessionid: context.state.config.sessionId,
                status: context.state.currentUser.status,
                chatobjectidlist: chatObjectId,
                randno: custom.generateChatRandomNumber(),
                xml: xmldata,
            };

            return new Promise((resolve, reject) => {
                client
                    .post("/LiveChat/events", custom.createRequest(requestData))
                    .then((response) => {
                        let result = custom.parseResponse(response);
                        context.state.lastRequest = Math.round(new Date().getTime() / 1000);
                        context.commit("parseEvents", result.events);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
        ,
        /**
         * @param context
         * @param params
         * @returns {Promise<unknown>}
         */
        sendMessage(context, params) {
            let chatobjectidlist = [];
            var xmldata = {
                events: {
                    chat: {
                        _attributes: {
                            chatobjectid: params.chatObjectId,
                        },
                        message: {
                            _attributes: {
                                guid: custom.generateGUID(),
                                type: params.type,
                                userdata: "",
                                base64: "1",
                                timestamp: Math.round(new Date().getTime() / 1000),
                            },
                            _text: custom.base64Encode(params.message),
                        },
                    },
                    confirmation: [],
                },
            };

            chatobjectidlist.push(params.chatObjectId);

            // append confirmations
            for (let item of context.state.activeChats) {
                let confirmations = context.getters.getConfirmationsToSendByChatObjectId(item.chatObjectId);
                if (confirmations.length !== 0) {
                    for (let c of confirmations) {
                        xmldata.events.confirmation.push(c);
                    }
                    chatobjectidlist.push(item.chatObjectId);
                }
            }

            var requestData = {
                sessionid: context.state.config.sessionId,
                status: context.state.currentUser.status,
                chatobjectidlist: chatobjectidlist.join(','),
                randno: custom.generateChatRandomNumber(),
                xml: xmldata,
            };

            return new Promise((resolve, reject) => {
                client
                    .post("/LiveChat/events", custom.createRequest(requestData))
                    .then((response) => {
                        let result = custom.parseResponse(response);
                        context.state.lastRequest = Math.round(new Date().getTime() / 1000);
                        context.commit("parseEvents", result.events);
                        context.commit("appendMessageToList", params);
                        resolve("done");
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        sendAttachment(context, params) {

            let activeChatObject = context.state.activeChats.find(x => x.chatObjectId === params.chatObjectId);
            let activeChatIndex = context.state.activeChats.indexOf(activeChatObject);

            params.chatSessionId = context.state.activeChats[activeChatIndex].chatSessionId;

            let formData = new FormData();
            formData.append('sessionid', context.state.config.sessionId);
            formData.append('chatsessionid', params.chatSessionId);

            //for (let i = 0; i < params.attachment.length; i++) {
            formData.append('imagecontainer[]', params.attachment);
            // }

            return new Promise((resolve, reject) => {
                client
                    .post("/LiveChat/Chat/UploadWeb", formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            }
                        }
                    )
                    .then((response) => {
                        if (Array.isArray(response.data)) {
                            let activeChatObject = context.state.activeChats.find(x => x.chatObjectId === params.chatObjectId);
                            let activeChatIndex = context.state.activeChats.indexOf(activeChatObject);
                            let content = '';
                            if (response.data.length > 1) {
                                content = response.data[1];
                                //append it in message list
                                if (activeChatIndex > -1) {
                                    context.state.activeChats[activeChatIndex].messages.push({
                                        base64: "1",
                                        chatObjectId: params.chatObjectId,
                                        content: content,
                                        from: "staff",
                                        fullName: context.state.currentUser.fullName,
                                        timestamp: Math.round(new Date().getTime() / 1000),
                                        type: "image",
                                        userId: null,
                                    })
                                }
                                resolve("done");
                            } else {
                                reject(response.data);
                            }
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });

        },
        sendConfirmations(context) {
            let newTime = Math.round(new Date().getTime() / 1000);
            let chatobjectidlist = [];
            let xmldata = {
                events: {
                    confirmation: []
                },
            };

            if (newTime - context.state.lastRequest < 10) {
                return new Promise((resolve) => {
                    resolve("done");
                });
            }

            if (context.state.activeChats.length) {
                // append confirmations
                for (let item of context.state.activeChats) {

                    //improvement needed
                    let confirmations = context.getters.getConfirmationsToSendByChatObjectId(item.chatObjectId);

                    if (confirmations.length !== 0) {
                        for (let c of confirmations) {
                            xmldata.events.confirmation.push(c);
                        }
                        chatobjectidlist.push(item.chatObjectId);
                    }
                }

                if (xmldata.events.confirmation.length === 0) {
                    return new Promise((resolve) => {
                        resolve("done");
                    });
                }

                var requestData = {
                    sessionid: context.state.config.sessionId,
                    status: context.state.currentUser.status,
                    chatobjectidlist: chatobjectidlist.join(','),
                    randno: custom.generateChatRandomNumber(),
                    xml: xmldata,
                };

                return new Promise((resolve, reject) => {
                    client
                        .post("/LiveChat/events", custom.createRequest(requestData))
                        .then((response) => {
                            let result = custom.parseResponse(response);
                            context.state.lastRequest = Math.round(new Date().getTime() / 1000);
                            context.commit("parseEvents", result.events);

                        })
                        .catch((error) => {
                            reject(error);
                        });
                });
            }
        },
        leave(context, chatObjectId) {
            var xmldata = {
                events: {
                    chat: {
                        _attributes: {
                            chatobjectid: chatObjectId,
                        },
                        chataction: {
                            _attributes: {
                                guid: custom.generateGUID(),
                                type: "leave",
                            },
                        },
                    },
                    confirmation: [],
                },
            };

            // append confirmations
            let confirmations = context.getters.getConfirmationsToSendByChatObjectId(chatObjectId);
            if (confirmations.length !== 0) {
                for (let c of confirmations) {
                    xmldata.events.confirmation.push(c);
                }
            }

            var requestData = {
                sessionid: context.state.config.sessionId,
                status: context.state.currentUser.status,
                chatobjectidlist: chatObjectId,
                randno: custom.generateChatRandomNumber(),
                xml: xmldata,
            };

            return new Promise((resolve, reject) => {
                client
                    .post("/LiveChat/events", custom.createRequest(requestData))
                    .then((response) => {
                        let result = custom.parseResponse(response);
                        context.state.lastRequest = Math.round(new Date().getTime() / 1000);
                        context.commit("parseEvents", result.events);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        /**
         * @todo send all confirmation before leaveAll
         * @param context
         * @returns {Promise<unknown>}
         */
        leaveAll(context) {
            let xmldata = {
                events: {
                    chat: [],
                    confirmation: [],
                },
            };
            let chatobjectidlist = [];


            if (context.state.activeChats === 0) {
                return new Promise((resolve) => {
                    resolve("done");
                });
            }

            //get chatObjectIds from active chats list
            for (let item of context.state.activeChats) {
                xmldata.events.chat.push({
                    _attributes: {
                        chatobjectid: item.chatObjectId,
                    },
                    chataction: {
                        _attributes: {
                            guid: custom.generateGUID(),
                            type: "leave",
                        }
                    }
                });

                // append confirmations
                // if (item.confirmations.length !== 0) {
                // 	for (let c of item.confirmations) {
                // 		xmldata.events.confirmation.push(c);
                // 	}
                // }

                chatobjectidlist.push(item.chatObjectId);
            }

            var requestData = {
                sessionid: context.state.config.sessionId,
                status: context.state.currentUser.status,
                chatobjectidlist: chatobjectidlist.join(','),
                randno: custom.generateChatRandomNumber(),
                xml: xmldata,
            };

            return new Promise((resolve, reject) => {
                client
                    .post("/LiveChat/events", custom.createRequest(requestData))
                    .then((response) => {
                        let result = custom.parseResponse(response);
                        context.commit("parseEvents", result.events);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        }
        ,
    }
    ,
    modules: {}
});