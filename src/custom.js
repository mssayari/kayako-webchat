var XMLTranslator = require("xml-js");
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
let custom = {
    generateChatRandomNumber() {
        return Math.round(new Date().getTime());
    },
    generateGUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    },
    base64Encode(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = this._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }

        return output;
    },

    // public method for decoding
    base64Decode(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        // eslint-disable-next-line no-useless-escape
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = this._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode(utftext) {
        var string = "";
        var i = 0;
        var c, c2, c3 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    },

    parseResponse(response) {
        return XMLTranslator.xml2js("<?xml" + response.data.split("<?xml")[1], {compact: true})
    },
    createRequest(requestData) {
        var params = new URLSearchParams();

        for (var index in requestData) {
            if (index === "xml") {
                requestData[index] = XMLTranslator.js2xml(requestData[index], {compact: true})
            }
            params.append(index, requestData[index]);
        }
        return params;
    },

    detectMobileDevice() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600) {
            return true
        } else {
            return false
        }
    },

    scanCannedMessages(obj, result) {
        if (obj.category !== undefined) {
            if (Array.isArray(obj.category)) {
                for (let category of obj.category) {
                    //avoid adding empty categories
                    if (category.category !== undefined || category.response !== undefined)
                        result.push({
                            id: category._attributes.id,
                            title: category._attributes.title,
                            children: this.scanCannedMessages(
                                category,
                                []),
                        });
                }

            } else {
                //avoid adding empty categories
                //if (obj.category.category !== undefined || obj.category.response !== undefined) {
                result.push({
                    id: obj.category._attributes.id,
                    title: obj.category._attributes.title,
                    children: this.scanCannedMessages(
                        obj.category,
                        []),
                });
                //}
            }
        }

        if (obj.response !== undefined) {
            if (Array.isArray(obj.response)) {
                for (let response of obj.response) {
                    result.push({
                        id: response._attributes.id,
                        title: response._attributes.title,
                        message: response.message ? response.message._cdata : null,
                        url: response.url ? response.url._cdata : null,
                        image: response.image ? response.image._cdata : null,
                    })
                }
            } else {
                result.push({
                    id: obj.response._attributes.id,
                    title: obj.response._attributes.title,
                    message: obj.response.message ? obj.response.message._cdata : null,
                    url: obj.response.url ? obj.response.url._cdata : null,
                    image: obj.response.image ? obj.response.image._cdata : null,
                })
            }
        }
        return result;
    },

    parseDepartmentsList(obj, result) {
        if (Array.isArray(obj)) {
            for (let department of obj) {
                result.push(
                    {
                        id: department._attributes.id,
                        title: department._attributes.title,
                    }
                );
                if (department.department !== undefined) {
                    result = result.concat(this.parseDepartmentsList(department.department, []));
                }
            }
        } else {
            result.push(
                {
                    id: obj._attributes.id,
                    title: obj._attributes.title,
                }
            );

            if (obj.department !== undefined) {
                result = result.concat(this.parseDepartmentsList(obj.department, []));
            }
        }

        return result;
    },
    parseStaffsFromGroup(staffgroup) {
        var newStaffList = [];
        if (!staffgroup.staff) {
            return;
        }

        //this group has more than one staff
        if (Array.isArray(staffgroup.staff)) {
            for (let staff of staffgroup.staff) {
                //skip if staff is not enable
                if (staff._attributes.isenabled !== "1") {
                    continue;
                }
                newStaffList.push({
                    departments: staff._attributes.departments.split(","),
                    email: staff._attributes.email,
                    fullName: staff._attributes.fullname,
                    lastActivity: staff._attributes.lastactivity,
                    lastVisit: staff._attributes.lastvisit,
                    sessionId: staff._attributes.sessionid,
                    staffId: staff._attributes.staffid,
                    status: staff._attributes.status,
                    username: staff._attributes.username,
                });
            }
        } else {
            //console.log(staffgroup.staff)
            newStaffList.push({
                departments: staffgroup.staff._attributes.departments.split(","),
                email: staffgroup.staff._attributes.email,
                fullName: staffgroup.staff._attributes.fullname,
                lastActivity: staffgroup.staff._attributes.lastactivity,
                lastVisit: staffgroup.staff._attributes.lastvisit,
                sessionId: staffgroup.staff._attributes.sessionid,
                staffId: staffgroup.staff._attributes.staffid,
                status: staffgroup.staff._attributes.status,
                username: staffgroup.staff._attributes.username,
            });
        }

        return newStaffList;
    }
}
export default custom