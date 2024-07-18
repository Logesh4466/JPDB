var jpdbBaseURl = "http://api.login2explore.com:5577";
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var stdDBName = 'SCHOOL-DB';
var stdRelationName = 'stdData';
var connToken = '90932206|-31949215671624407|90963517';

$('stdid').focus();

function saveRecNo2Ls(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getStdIdAsJsonObj() {
    var stdid = $('#stdid').val();
    var jsonStr = {
        id : stdid
    };
    return JSON.stringify(jsonStr);
}


function fillData(jsonObj){
    saveRecNo2Ls(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#stdname').val(record.name);
    $('#stdclass').val(record.Class);
    $('#std-Bdate').val(record.Bdate);
    $('#std-addres').val(record.address);
    $('#std-Edate').val(record.Edate);

}


function resetForm(){
    $('#stdid').val("");
    $('#stdname').val("");
    $('#stdclass').val("");
    $('#std-Bdate').val("");
    $('#std-addres').val("");
    $('#std-Edate').val("");
    $('#stdid').prop('disabled', false);
    $('#save').prop('disabled', true);
    $('#change').prop('disabled', true);
    $('#reset').prop('disabled', true);
    $('#stdid').focus();
}

function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj === ''){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName,stdRelationName);
    jQuery.ajaxSetup({async:false});
    var resjsonobj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURl, jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('#stdid').focus();
}


function changeData(){
    $('#change').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stdDBName,stdRelationName,localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resjsonobj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURl, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resjsonobj);
    resetForm();
    $("#stdid").focus();
}


function validateData(){
    var stdid, stdname, stdclass, std_Bdate, std_address, std_Edate;
    stdid =  $('#stdid').val();
    stdname = $('#stdname').val();
    stdclass = $('#stdclass').val();
    std_Bdate = $('#std-Bdate').val();
    std_address = $('#std-addres').val();
    std_Edate =  $('#std-Edate').val();

    if (stdid === ''){
        alert("Roll no Missing")
        $('#stdid').focus();
        return "";
    }
    if (stdname === ''){
        alert("Fullname Missing")
        $('#stdname').focus();
        return "";
    }
    if (stdclass === ''){
        alert("Class Missing")
        $('#stdclass').focus();
        return "";
    }
    if (std_Bdate === ''){
        alert("Birth date  Missing")
        $('#std-Bdate').focus();
        return "";
    }
    if (std_address === ''){
        alert("Address Missing")
        $('#std-addres').focus();
        return "";
    }
    if (std_Edate === ''){
        alert("Enrollment Date Missing")
        $('#std-Edate').focus();
        return "";
    }

    var jsonStrObj = {
        id : stdid,
        Name : stdname,
        Class : stdclass,
        Birthdate : std_Bdate,
        Address : std_address,
        EnrollmentDate : std_Edate
    };
    return JSON.stringify(jsonStrObj);

}

function getStd(){
    var stdidjsonobj = getStdIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdRelationName, stdidjsonobj);
    jQuery.ajaxSetup({async:false});
    var resjsonobj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURl, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if (resjsonobj.status === 400){
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#stdname').focus();
    }
    else if (resjsonobj.status === 200){
        $('#stdid').prop('disabled', false);
        fillData(resjsonobj);

        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#stdname').focus();
    }
}