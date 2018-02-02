var i_input,b_ins,b_del,b_ser,b_nstep;
var count_nodes=0,key,wwidth,wheight,totnods=63,msg;
var arr=[],mainarr=[];
var msg=[],msgflag=0,next=0,nexttot=0;
var highlight=[];
var bkcol='#b3d9ff';
var simulation=false;

msg[0]='';
msg[1]='INVALID INPUT';
msg[2]='NODE INSERTED';
msg[3]='NODE ALREADY PRESENT';
msg[4]='NODE DELETED';
msg[5]='NODE IS PRESENT';
msg[6]='NODE IS ABSENT';
msg[7]='TREE LIMIT REACHED';

function setup() {
  wwidth=window.innerWidth;
  wheight=window.innerHeight;
  createCanvas(wwidth,wheight);

  i_input = createInput();
  i_input.position(20, 110);

  b_ins = createButton('INSERT');
  b_ins.position(i_input.x + i_input.width, 110);
  b_ins.mousePressed(f_ins);

  b_del = createButton('DELETE');
  b_del.position(b_ins.x + b_ins.width, 110);
  b_del.mousePressed(f_del);

  b_ser = createButton('SEARCH');
  b_ser.position(b_del.x + b_del.width, 110);
  b_ser.mousePressed(f_ser);

  //Creating nested(2D) array of 63 rows
  for(var i=0;i<totnods;i++){
    mainarr[i]=[];
    arr[i]=[];
  }
  count_nodes=0;
  console.log(wwidth);
}

function draw(){
  background(bkcol);
  frameRate(30);
  
  //test message
  if(!simulation){
    fill('#961515');
    noStroke();
    textSize(24);
    textStyle(BOLD);
    textAlign(LEFT,CENTER);
    text(msg[msgflag],15,55);
  }

  //no nodes
  if(count_nodes==0){
    b_ser.attribute('disabled','');
  }
  
  for(var i=0;i<totnods;i++){
    if(mainarr[0][0]==null){
      break;
    }
    else{
      
      if(mainarr[i][0]!=null){
        var l=2*i+1,r=2*i+2;
        if(next==nexttot||!simulation){          
          copyarr();
          b_nstep.remove();
          b_ins.removeAttribute('disabled');
          b_ser.removeAttribute('disabled');
          b_del.removeAttribute('disabled');
          i_input.removeAttribute('disabled');
          simulation=false;
        }
        if(arr[l]!=null&&l<totnods){
          stroke(150);
          strokeWeight(4);
          line(arr[i][1],arr[i][2],arr[l][1],arr[l][2]);
        }
        if(arr[r]!=null&&r<totnods){
          stroke(150);
          strokeWeight(4);
          line(arr[i][1],arr[i][2],arr[r][1],arr[r][2]);
        }

        noStroke();
        if(arr[i][0]==highlight[next]){
          fill('#121212');
          ellipse(arr[i][1],arr[i][2],70,70);
        }
        fill('#0080ff');
        ellipse(arr[i][1],arr[i][2],50,50);
        fill(255);
        textAlign(CENTER,CENTER);
        textStyle(NORMAL);
        textSize(20);
        try{text(arr[i][0],arr[i][1],arr[i][2]);}
        catch(Exception){}
        fill(0);
        if(key<highlight[next]&&simulation){
          textAlign(CENTER,CENTER);
          text(''+key+' < '+highlight[next],wwidth/2,65);
        }
        else if(key>highlight[next]&&simulation){
          textAlign(CENTER,CENTER);
          text(''+key+' > '+highlight[next],wwidth/2,65);
        }
      }

    }
  }
}

function f_ins() {
  
    key=i_input.value().replace(/\s+/g,"");
    i_input.value('');
    clearhl();
    if(isFinite(key)&&key!=''){
    b_ins.attribute('disabled','');
    b_ser.attribute('disabled','');
    b_del.attribute('disabled','');
    i_input.attribute('disabled','');
    simulation=true;
    key=float(key);

      b_nstep = createButton('NEXT STEP');
      b_nstep.mousePressed(f_nstep);
      b_nstep.position(wwidth/2-40, 110);
    
    msgflag=0;
    next=0;
    copyarr();
    
    var i=0,j=1;
    var x=window.width/2, y=150;
    var len=x,dup=false;
    
    while(i<totnods&&mainarr[i][0]!=null){
      highlight[next++]=mainarr[i][0];
      if(mainarr[i][0]<key){
        i=2*i+2;
        x=x+len/pow(2,j);
      }
      else if(mainarr[i][0]>key){
        i=2*i+1;
        x=x-len/pow(2,j);
      }
      else{
        //duplicate value
        msgflag=3;
        highlight[next]=arr[i][0];
        dup=true
        break;
      }
      y+=150;
      j++;
      if(j>6){
        msgflag=7;
        break;
      }
    }
    if(!dup&&i<totnods){
      mainarr[i][0]=key;
      mainarr[i][1]=x;
      mainarr[i][2]=y;
      msgflag=2;
      highlight[next++]=mainarr[i][0];
      count_nodes++;
    }
      nexttot=next-1;
      next=0;
    } 
    else{
      msgflag=1;
    }
}

function f_del(){}

function f_ser(){

    key=i_input.value().replace(/\s+/g,"");
    i_input.value('');
    clearhl();
    if(isFinite(key)&&key!=''){
      simulation=true;
      b_ins.attribute('disabled','');
      b_ser.attribute('disabled','');
      b_del.attribute('disabled','');
      i_input.attribute('disabled','');
      key=float(key);
      if(totnods>0){
        b_nstep = createButton('NEXT STEP');
        b_nstep.mousePressed(f_nstep);
        b_nstep.position(wwidth/2-40, 110);
      }

      msgflag=0;
      var i=0;
      next=0;
      var limitflag=false;


      while(key!=mainarr[i][0]&&i<totnods){
        highlight[next++]=mainarr[i][0];
        if(mainarr[i][0]==null){

          break;
        }
        else if(key<mainarr[i][0]){
          i=2*i+1;
        }
        else if(key>mainarr[i][0]){
          i=2*i+2;
        }
        if(i>totnods){
          limitflag=true;
          break;
        }
      }
      //node present
      if(!limitflag&&mainarr[i][0]==key){
        mainarr[i][3]=true;
        msgflag=5;
        highlight[next++]=mainarr[i][0];
      }
      //node absent
      else{
          if(limitflag)
            msgflag=6;
          else
            msgflag=6;
      }
      nexttot=next-1;
      next=0;
    }
    else{
      msgflag=1;
    } 
}

function f_nstep(){
  next++;
}

function copyarr(){
  for(var i=0;i<totnods;i++){
    for(var j=0;j<3;j++)
      arr[i][j]=mainarr[i][j];
  }
}

function clearhl(){
  for(var i=0;i<totnods;i++)
    highlight[i]=null;
}