"use strict";
//
//  Salesforce Leads
//
$(document).ready(CDF_Initialize);

var currentLocObject = null;

function CDF_Ready()
{
    //
    //  Declare whether or not this application would benefit from data caching
    //
    Emotive.App.Collections.allowCaching(true);

    var requestedQueries = new Array();
    requestedQueries.push(new DeclareDataValueObject("Emotive.Data.Account","Account"));
    requestedQueries.push(new QueryRequestObject({op:'SELECT', targetType:'Account'},"Emotive.Data.allAccounts","Emotive.Data.allAccountsHash",{extraHashKey:"externalId"}));
    Emotive.Service.submit(requestedQueries, onRequestDataReady);

    //
    // Declare an event handler to fire before the #Loading page is about to be shown.
    //
    $('#Loading').bind('pagebeforeshow', function(event)
    {
        Emotive.Ui.Header.setTitle("Loading...");
    });

//
// Declare an event handler to fire before the #MainPage page is about to be shown.
//
    $('#MainPage').bind('pagebeforeshow', function(event)
        {
            Emotive.Ui.Header.setTitle("Accounts");
            Emotive.Ui.Header.setBackButton(null);
            //Emotive.Ui.Header.serRightButton("Search",function(){
              //  Emotive.App.changePage("#accFilters");
            //});
        }
    );

    //
    // Declare an event handler to fire before the #LeadDetail page is about to be shown.
    //
    $('#accDetail').bind('pagebeforeshow', function(event)
        {
            Emotive.Ui.Header.setTitle(Emotive.Data.Account.Name);
            Emotive.Ui.Header.setBackButton('#MainPage');
        }
    );
}


//
//  This gets called when the MetaData and Query requests have completed; we have all our data
//	and we are ready to start.
//
function onRequestDataReady()
{
    $("#accList").empty();

    var s = "";

    Emotive.Js.Arrays.sortObjectsByString(Emotive.Data.allAccounts, "Name", true);

    for (var i=0; i<Emotive.Data.allAccounts.length; i++)
    {
        var Account = Emotive.Data.allAccounts[i];

        s +=    '<li>' +
                    '<a href="javascript:selectAccount(\'' + Account.externalId + '\')">' +
                        Account.Name +
                    '</a>' +
                '</li>';
    }

    $("#accList").append(s);

    Emotive.$.refreshListview("#accList");

    Emotive.App.changePage("#MainPage");
};

function selectAccount(externalId)
{
    var Account = Emotive.Data.allAccountsHash[externalId];

    Emotive.Data.set("Emotive.Data.Account",Account);

    //$("#theEmail").attr('href', 'mailto:' + Emotive.Data.Account.Email);
    $("#thePhone").attr('href', 'tel:' + Emotive.Data.Account.Phone);

    Emotive.App.changePage("#accDetail");
}

// Redirect to new page Lead
function newAccountPage(){
    Emotive.App.changePage("#accFilters");
}

function saveAcc(){

    alert($("#lName").val());

    var newAcc = new Object();

    newAcc.Name = 'Test Emotive 1';
    //newAcc.Company= 'Sakonent';

    var request = Emotive.Query.createInsert("Account",newAcc);

     FW.submitToServer(function (requestArray) {

       //AccCallback();

    }, [new NonQueryRequestObject(request, "DM.objSearchResult")]);
}


var eQFil = new Emotive.Query.Filter();

function applyFilters(tradeChannel, AccFields, relatedList, lookUp){
    if(tradeChannel != null)
        eQFil.equalTo("Trade_Channel__c",tradeChannel);

    if (AccFields.length > 0){
        /*for(var i=0; i<AccFields.length; i++){
            eQFil.equalTo(AccFields[i],)
        }*/
    }

    if (relatedList != null)
        // related filters

    if (lookUp != null)
        //lookup filters

    return eQFil;
        
}

function selAccount(){


    

    var leadSelFilter = new Emotive.Query.Filter();
    leadSelFilter.equalTo("Name","GenePoint");
    leadSelFilter.equalTo("Phone","(650) 867-3450");
    

    leadSelFilter.equalTo("Name","GenePoint");

    var request = Emotive.Query.createSelect("Account", leadSelFilter);

    FW.submitToServer(function (requestArray){

        alert(DM.objAccFR.length);

    },[new QueryRequestObject(request,"DM.objAccFR")]);
}

