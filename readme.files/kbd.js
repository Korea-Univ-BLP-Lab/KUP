/*
   MoinMoin Hotkey

   Copyright(c) 2002 by Byung-Chan Kim
   Copyright(c) 2003 by Won-kyu Park <wkpark @ kldp.org>

   distributable under GPL

   $Id: kbd.js,v 1.3 2003/08/10 12:00:37 wkpark Exp $

   CHANGES

   * 2002/09/06 : From http://linux.sarang.net/ and heavily modified by wkpark
   * 2003/04/16 : simlified by wkpark
   * 2003/06/01 : added patch by Kkabi
   * 2003/07/14 : fixed element indices
*/

/*
 <form name="go" id="go" method="get" action='$url' onsubmit="return moin_submit();">
 <input type="text" name="value" size="20" style="width:100" />
 <input type="hidden" name="action" value="goto" />
 <input type="submit" name="status" value="Go" class="goto" style="width:23px;" />
 </form>
*/

/*
   D: ?action=diff
   I: ?action=info
   E/W: ?action=edit
   F: FrontPage
   C: RecentChanges
   T: TitleIndex
   H: ?action=home (not supported in the MoinMoin)
   L: ?action=LikePages

   <ESC>: goto the 'go' form
   /: FullSearch mode
   ?: TitleSearch mode

   F1: HelpContents
   F3: FindPage
*/

// uncomment bellow two lines and custumize for your wiki.

//url_prefix="/mywiki";
//FrontPage="/FrontPage";
RecentChanges="/RecentChanges"; 
FindPage="/FindPage"; 
TitleIndex="/TitleIndex"; 
HelpContents="/HelpContents"; 

_dom=0;

function keydownhandler(e) {
        if(document.all) e= window.event; // for IE
        if(_dom==3) var EventStatus= e.srcElement.tagName;
        else if(_dom==1) var EventStatus= e.target.nodeName; // for Mozilla

        var cc = '';
        var ch = '';

        if(_dom==3) { // for IE
                if(e.keyCode>0) {
                        ch=String.fromCharCode(e.keyCode);
                        cc=e.keyCode;
                }
        } else { // for Mozilla
                cc=e.keyCode;
                if(e.charCode>0) {
                        ch=String.fromCharCode(e.charCode);
                }
        }

//	if (_dom!=3) return;
        if(EventStatus == 'INPUT' || EventStatus == 'TEXTAREA' ) {
          if (_dom==3 && cc==27 && EventStatus == 'TEXTAREA') return false;
          // ESC blocking for all vim lovers
                return;
        }
//	if (cc==8) { // Backspace blocking
//              alert(e.keyCode);
//                if( _dom==3 && strs.length > 0) {
//                        //strs=strs.substr(0,strs.length-1);
//                        //document.getElementById("status").innerHTML=strs;
//                }
//                return false;
//        }
        return
}

function keypresshandler(e){
        if(document.all) e=window.event; // for IE
        if(_dom==3) var EventStatus= e.srcElement.tagName;
        else if(_dom==1) var EventStatus= e.target.nodeName; // for Mozilla

        var cc = '';
        var ch = '';

        if(_dom==3) { // for IE
                if(e.keyCode>0) {
                        ch=String.fromCharCode(e.keyCode);
                        cc=e.keyCode;
                }
        } else { // for Mozilla
                cc=e.keyCode;
                if(e.charCode>0) {
			ch=String.fromCharCode(e.charCode);
		}
	}
	if(EventStatus == 'INPUT' || EventStatus == 'TEXTAREA' || _dom == 2) {
		if ((ch == '?' || ch== '/') && EventStatus == 'INPUT') {
			var my=""+document.go.elements['value'].value;
			if (ch == '?') {
			 if (document.go.elements['status'].value == '?') {
                	  document.go.elements['action'].value="goto";
                	  document.go.elements['status'].value="Go";
			  window.status="GoTo";
			 } else {
                	  document.go.elements['action'].value="titlesearch";
                	  document.go.elements['status'].value="?";
			  window.status="TitleSearch";
			 }
			} else {
			 if (document.go.elements['status'].value == '/') {
                	  document.go.elements['action'].value="goto";
                	  document.go.elements['status'].value="Go";
			  window.status="GoTo";
			 } else {
                	  document.go.elements['action'].value="fullsearch";
                	  document.go.elements['status'].value="/";
			  window.status="FullSearch";
			 }
			}
			if (my == '/' || my == '?')
			document.go.elements['value'].value=my.substr(0,my.length-1);
                } else if (cc== 27 && EventStatus == 'INPUT') {
			document.go.elements['value'].blur();
			document.go.elements['value'].value='';
               		document.go.elements['action'].value="goto";
               		document.go.elements['status'].value="Go";
			window.status="GoTo"+window.defaultStatus;
		}
		return;
        }
        if(e.altKey || e.ctrlKey) return;

        if(_dom != 3 && cc == 229 && ch == '') { // Mozilla
                window.status="?/ or change IME status";
        } else if(_dom !=3 && cc == 112) { // 'F1' Help! (Mozilla only)
                self.location = url_prefix + HelpContents;
        } else if(_dom !=3 && cc == 114) { // 'F3' Find (Mozilla only)
                self.location = url_prefix + FindPage;
        } else if(cc == 9 || cc == 27) { // 'TAB','ESC' key
                if (cc == 27) {
                        document.go.elements['value'].focus();
                }
        } else if(ch == "/" || ch == "?") {
                if (ch == "?") {
                // Title search as vi way
                document.go.elements['value'].focus();
                document.go.elements['action'].value="titlesearch";
                document.go.elements['status'].value="?";
                } else if ( ch == "/") {
                // Contents search
                document.go.elements['value'].focus();
                document.go.elements['action'].value="fullsearch";
                document.go.elements['status'].value="/";
                }
        } else if(ch == "c") {
                self.location = url_prefix + RecentChanges;
        } else if(ch == "d" || ch== "i" || ch=="b" || ch=="l" || ch=="h") {
                var my=''+self.location;
                var idx=my.indexOf("?");
                if (idx != -1) {
                        my=my.substr(0,idx);
		}
		if (ch == "d")
                    my +='?action=diff';
		else if (ch == "i")
                    my +='?action=info';
		else if (ch == "b")
                    my +='?action=bookmark';
		else if (ch == "h")
                    my +='?action=home';
		else if (ch == "l")
                    my +='?action=LikePages';
		self.location=my;
		
        } else if(ch == "f") { // frontpage
                self.location = url_prefix + FrontPage;
        } else if(ch == "s" || ch == 'q') { // findpage
                self.location = url_prefix + FindPage
        } else if(ch == "t") { // frontpage
                self.location = url_prefix + TitleIndex
        } else if(ch=="e" || ch=="w" || ch=="r") { // Edit or reflash
                var my=''+self.location;
                var idx=my.indexOf("?");
                if (idx != -1 && my.substr(idx+1,5) == "goto=") {
                        my=my.substr(idx+6,my.length-6);
                        if ((idx=my.indexOf("&")) != -1)
                                my=my.substring(0,idx);
                        if (ch == "e" || ch == "w")
                                self.location=url_prefix +'/'+my+'?action=edit';
                        if (ch == "r") {
                                if ((idx=my.indexOf("#")) != -1)
                                        my=my.substring(0,idx);
                                self.location=url_prefix+ '/'+my+'?action=show';                        }
                } else {
                        if (ch == "e" || ch == "w")
                                self.location = '?action=edit';
                        if (ch == "r") {
                                if ((idx=my.indexOf("#")) != -1) {
                                        my=my.substring(0,idx);
                                        self.location = my + '?action=show';
                                } else
                                        //self.location += '?action=show';
                                        self.location = self.location;
                        }
                }
        }
        return;
}

function input(){
        _dom=document.all ? 3 : (document.getElementById ? 1 : (document.layers ? 2 : 0));
        document.onkeypress = keypresshandler;
        document.onkeydown = keydownhandler;
}

function moin_submit() {
	if (document.go.elements['action'].value =="goto") {
		document.go.elements['value'].name='goto';
		document.go.elements['action'].name='';
		return true;
	}
}

input();
