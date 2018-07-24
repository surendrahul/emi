function _(id){
	return document.getElementById(id);
}

function changeAmount(obj){
	_('amountSlider').value=obj;
	_("amount").value=obj;
	calculationOfEMI();
	//drawChart();
	//createTable();
}
function changeTime(obj){
	_('timeSlider').value=obj;
	_("time").value=obj;
	calculationOfEMI();
	//drawChart();
	//createTable();
}
function changeRate(obj){
	_('rateSlider').value=obj;
	_("rate").value=obj;
	calculationOfEMI();
	//drawChart();
	//createTable();
}
function calculationOfEMI(){
	var p=_('amount').value;
	var t=_("time").value;
	var r=_("rate").value;
	r=r/1200;
	if(yearCount==1){
		t=t*12;
	}
	//console.log(t);
	var EMI=p*r*((Math.pow(1+r,t))/(Math.pow(1+r,t)-1));
	EMI=Math.round(EMI);
	_("emi").innerHTML="Rs."+(EMI);
	_("intrest").innerHTML=Math.round(EMI*t-p);
	_("totalPayable").innerHTML="Rs."+Math.round(EMI*t);
	
	createTable(p,r,t,EMI);
	drawPieChart();
	drawStackChart();
}

var monthCount=0;
var yearCount=0;
function onMonth(){
	var tenur=_("timeSlider");
	var timeIn=_("time").value;
	tenur.setAttribute("max","120");
	tenur.setAttribute("step","1");
	//console.log(tenur);
	if(monthCount==0){
		monthCount++;
		yearCount=0;
		_("time").value=timeIn*12;
		_("timeSlider").value=timeIn*12;
	}

		//console.log(monthCount)
}
function onYear(){
	var tenur=_("timeSlider");
	var timeIn=_("time").value;
	tenur.setAttribute("max","10");
	tenur.setAttribute("step","0.5");
	//_("time").value=time/12;
	//console.log(tenur);
	if(yearCount==0){
		yearCount++;
		monthCount=0;
		_("time").value=Math.ceil(timeIn/12);
		_("timeSlider").value=Math.ceil(timeIn/12);
	}
		//console.log(yearCount);
}

// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawPieChart);
function drawPieChart() {
	drawPieChartData();
    var data = google.visualization.arrayToDataTable(myDrawData);
    var options={'title':'Break-up of Total Payment','backgroundColor':'rgb(244,244,244)','colors':["#88A825","#ED8C2B"]};
    var chart = new google.visualization.PieChart(document.getElementById('paichart'));
    chart.draw(data, options);
}
function drawPieChartData(){
	var pieAmt=_("amount").value;
	var pieInt=_("intrest").innerHTML;
	myDrawData=[[],[],[]];
	myDrawData[0][0]="task";
	myDrawData[0][1]="In Rupees";
	myDrawData[1][0]="Principle";
	myDrawData[1][1]=pieAmt*1;
	myDrawData[2][0]="Intrest";
	myDrawData[2][1]=pieInt*1;
}
google.charts.setOnLoadCallback(drawStackChart);
function drawStackChart() {
            // Define the chart to be drawn.
     drawStackChartData();       
    var data = google.visualization.arrayToDataTable(dataForStack);
    var options = {title: '', isStacked:true,'backgroundColor':'rgb(244,244,244)','colors':["#88A825","#ED8C2B"]};  
    // Instantiate and draw the chart.
    var chart = new google.visualization.ColumnChart(document.getElementById('stackChart'));
    chart.draw(data, options);
}
function drawStackChartData(){
	var sDate= new Date();
	var stackYear=sDate.getFullYear();
	//console.log(stackYear,startYear);
	dataForStack=[['Genre', 'principal paid','Intrest Paid']];
	for (var i = stackYear; i <= startYear; i++) {
		dataForStack.push([i.toString(),(document.getElementById('pri'+i).innerText)*1,(document.getElementById('int'+i).innerText)*1]);
	}	//data.push(['k','i','j'])
	//console.log(dataForStack);
}

function _html(ele,content){
	return "<"+ele+">"+content+"</"+ele+">";
}

var startYear=0;
var mName=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
function createTable(p,r,t,emi){
	var output="";
	//var noOfMonth=_("");
	//console.log(t,p,r,emi);
	output += "<table id='mainTable' ><tr class='yrReport'>";
	output += "<th id='thMon'>MONTH/YEAR</th>"  // _html("th","MONTH");
	output += "<th id='thInt'>INTEREST</th>"
	output += "<th id='thPri'>PRINCIPAL</th>";
	output += "<th id='thEmi'>EMI</th>";
	output += "<th id='thBal'>BALANCE</th>";
	output+="</tr></table>";
	_("intrestTable").innerHTML=output;

	var dt=new Date;
	var startMonth=dt.getMonth();
	startYear=dt.getFullYear()
	var yearWiseInt=0;
	var yearWisePri=0;
	var yearWiseEmi=0;
	var year_wise="";
	year_wise+="<tr>";
	year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id=year"+startYear+"><span>&plus;</span>"+startYear+"</td>";
	year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id=int"+startYear+">"+startYear+"</td>";
	year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id=pri"+startYear+">"+startYear+"</td>";
	year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id=emi"+startYear+">"+startYear+"</td>";
	year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id=bal"+startYear+">"+startYear+"</td>";
	year_wise+= "</tr>";
	_("mainTable").innerHTML+=year_wise;
	while(t>0){
		var month_wise="";
		var si=Math.round(p*r);
		var principal=emi-si;
		p = p - principal > 0 ? p - principal : 0;

		//console.log(mName[startMonth]);
		month_wise+="<tr class='monthRow "+startYear+"' id=month"+startYear+">"
		month_wise+=  "<td class='tdMonth'>"+mName[startMonth]+"</td>";
		month_wise+=  "<td class='tdMonth'>"+si+"</td>";
		month_wise+=  "<td class='tdMonth'>"+principal+"</td>";
		month_wise+=  "<td class='tdMonth'>"+emi+"</td>";
		month_wise+=  "<td class='tdMonth'>"+p+"</td>";
		month_wise+="</tr>"
		_("mainTable").innerHTML+=month_wise;
		yearWiseInt+=si;
		yearWisePri+=principal;
		yearWiseEmi+=emi;
		_('int'+startYear).innerText=yearWiseInt;
		_('pri'+startYear).innerText=yearWisePri;
		_('emi'+startYear).innerText=yearWiseEmi;
		_('bal'+startYear).innerText=p;
		if(startMonth==11 && t!=1){
			startYear++;
			year_wise="";
			year_wise+="<tr>";
			year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id="+startYear+"><span>&plus;</span>"+startYear+"</td>";
			year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id=int"+startYear+">"+startYear+"</td>";
			year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id=pri"+startYear+">"+startYear+"</td>";
			year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id=emi"+startYear+">"+startYear+"</td>";
			year_wise+= "<td class='tdYear' onclick='expand("+startYear+")' id=bal"+startYear+">"+startYear+"</td>";
			year_wise+-"</tr>";
			_("mainTable").innerHTML+=year_wise;
			startMonth=0;
			yearWiseEmi=0;
			yearWisePri=0;
			yearWiseInt=0;
		}
		else{
			startMonth++;
		}
		t--;
	}
	//output+=month_wise;
	//_("intrestTable").innerHTML=output;
}

function expand(obj){
	var show =document.getElementsByClassName(obj);
	var open=show[0];
	//console.log(show);
	if(open.style.display=="none" || open.style.display==""){
		for(var i=0; i<show.length; i++){
		var item=show[i];
		item.style.display="table-row";
		}
	}
	else{
		for(var i=0; i<show.length; i++){
		var item=show[i];
		item.style.display="none";
		}
	}
	
	
}
function loanType(obj){
	_("personalLoan").style.backgroundColor="rgb(222,222,222)";
	_("carLoan").style.backgroundColor="rgb(222,222,222)";
	_("homeLoan").style.backgroundColor="rgb(222,222,222)";
	_(obj.id).style.backgroundColor="rgb(244,244,244)";
	if(obj.id=="homeLoan"){
		//console.log("hi homeloan");
		_("rateSlider").max=20;
		_("amountSlider").max=10000000;
		_("amountSlider").step=100000;
		if(_("monthRadio").checked){
			_("timeSlider").max=360;
			_("timeSlider").step=1;
		}
		else{
			_("timeSlider").max=30;
			_("timeSlider").step=.5;
		}

	}
	else if(obj.id=="personalLoan"){
		//console.log("hi personalLoan");
		_("rateSlider").max=25;
		_("amountSlider").max=500000;
		_("amountSlider").step=10000;
		if(_("monthRadio").checked){
			_("timeSlider").max=96;
			_("timeSlider").step=1;
		}
		else{
			_("timeSlider").max=8;
			_("timeSlider").step=.5;
		}
	}
	else if(obj.id=="carLoan"){
		//console.log("hi carLoan");
		_("rateSlider").max=20;
		_("amountSlider").max=2500000;
		_("amountSlider").step=10000;
		if(_("monthRadio").checked){
			_("timeSlider").max=60;
			_("timeSlider").step=1;
		}
		else{
			_("timeSlider").max=5;
			_("timeSlider").step=.5;
		}
	}
}

