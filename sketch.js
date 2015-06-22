/**
*=================================================================
*"Dibujo improvisado en Fa sostenido (?)"
*Sketch hecho para la asignatura Imagen Escrita (2015).
*Hecho por Enzo Barbaguelatta D.
*elsemieni.net
*=================================================================
**/


//=================================================================
//Clase Pelota: Dibuja una pelota en pantalla.

function Pelota(tam, x, y)
{
	//Definición de variables
	this.surface=null;
	this.iniciado=false;
	this.x=x;
	this.y=y;
	this.tam=tam;
	
	//Dibujar la pelota en una superficie
	this.surface= createGraphics(tam, tam);
	this.surface.fill(color(255,255,255,128));
	this.surface.noStroke();
    this.surface.ellipse(tam/2,tam/2,tam,tam);
	this.lineax=-1;
	this.lineay=-1;
}

Pelota.prototype.draw = function(frecuencia, volume) {
	//Dibjar la pelota en cierta posicion del sketch dependiendo de la frecuencia y el volumen.
	
   this.x=map(frecuencia,FRECUENCIA_UMBRAL_BAJA,FRECUENCIA_UMBRAL,0,width);
   this.y=map(volume,0,VOLUMEN_UMBRAL,0,height);
   
   //Si los valores exceden el sketch, limitarlos a ello.
   if  (this.y<0) this.y=0;
   if  (this.y>height) this.y=height;
   if (this.x<0) this.x=0;
   if (this.x>width) this.x=width;
   
   //Usado para depuración
   console.log("Freq: " + frecuencia + " Volume: " + volume + " Coordenadas resultantes: " + this.x + ", " + this.y);
   
   //Pintar o borrar segun esté configurado.
   if (!pincelBorrador)
   {
	   tint(255-map(volume,0,VOLUMEN_UMBRAL,0,255),map(frecuencia,261.63, FRECUENCIA_UMBRAL,0,255),255-map(frecuencia,261.63, FRECUENCIA_UMBRAL,0,255), map(volume,0,VOLUMEN_UMBRAL,0,255));
	   stroke(255-map(volume,0,VOLUMEN_UMBRAL,0,255),map(frecuencia,261.63, FRECUENCIA_UMBRAL,0,255),255-map(frecuencia,261.63, FRECUENCIA_UMBRAL,0,255), map(volume,0,VOLUMEN_UMBRAL,0,32));
   }
   else 
   {
	   stroke(COLOR_FONDO,128);
	   tint(COLOR_FONDO,128);
   }
   
   //Dibujar pelota y lineas de seguimiento.
   image(this.surface,this.x,height-this.y,map(volume,0.0,VOLUMEN_UMBRAL,0.0,this.tam),map(volume,0.0,VOLUMEN_UMBRAL,0.0,this.tam));
   strokeWeight(5);
   line(this.lineax,this.lineay,this.x,this.y);
   this.lineax=this.x;
   this.lineay=this.y;
   noStroke();
   
 };
 
//==========================================================================================
//Clase AudioReader: Clase que extrae volumen y frecuencia del microfono del computador.

function AudioReader()
{
	//Creación del objeto audio (microfono y FFT).
	this.minim=new p5.AudioIn();
	this.fft=new p5.FFT(0.8,TAM_BUFFER);
	
	this.max=[];
	this.frecuencia;
	
	//Inicialización de audio y conectandolo a FFT.
	this.minim.start();
	this.fft.setInput(this.minim);
}

AudioReader.prototype.draw = function()
{
	//Efectuo un analisis espectral.
	var espectro=this.fft.analyze();
	
	//Extraigo las intensidades de cada frecuencia del espectro en el fragmento actual de audio.
	for (var f=0;f<22048;f++) {
		this.max[f]=this.fft.getEnergy(f);
	}
	
	//Del espectro extraido busco la de mayor intensidad.
	var maximo=max(this.max);
	
	//La de mayor intensidad será la frecuencia actual.
	for (var i=0;i<this.max.length;i++)
	{
		if (this.max[i] == maximo) {
			this.frecuencia= i;
		}
	}
	
};

//Retorna la frecuencia ya calculada
AudioReader.prototype.freq = function()
{
	return this.frecuencia;
};

//Retorna el volumen actual
AudioReader.prototype.volume= function()
{
	return this.minim.getLevel();
};
//=================================================================
//Variables globales para el sketch
var pelota;
var audioReader;
var frecuencia;
var volume;
var pincelBorrador=false;

function preload()
{
	//Cargar las instrucciones antes.
	img = loadImage("aviso.jpg");
}

//Creo el sketch.
function setup() {
  createCanvas(ANCHO, ALTO);
  background(0);
  blendMode(DIFFERENCE);
  
  //Creo el pincel pelota y el motor de audio
  pelota= new Pelota(TAM_PINCEL,width/2,height);
  audioReader = new AudioReader();
  
  //Imprimo las instrucciones
  image(img, (width/2)-160, (height/2)-120);

}

function draw() {
  //Actualizo cada elemento del sketch.
  audioReader.draw();
  frecuencia=audioReader.freq();
  volume=audioReader.volume();
  pelota.draw(frecuencia, volume);
}

//Si se presiona alguna tecla...
function keyPressed()
{
  //borrar todo, y volver a imprimir las instrucciones
  if ( key == 'x' || key == 'X' )
  {
	blendMode(BLEND);
    background(0);
	image(img, (width/2)-160, (height/2)-120);
	blendMode(DIFFERENCE);
	pincelBorrador=false;
  }
  
  //cambiar a pincel borrador y viceversa.
    if ( key == 'b' || key == 'B' )
  {
	  if (!pincelBorrador) //prender pincel borrador
	  {
		  blendMode(BLEND);
		  pincelBorrador=true;
	  }
	  else
	  { //apagar pincel borrador
		blendMode(DIFFERENCE);
		pincelBorrador=false;
		  
	  }	
  }
}

//=================================================================