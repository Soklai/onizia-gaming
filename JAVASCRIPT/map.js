export class Map {
  constructor(){
    this.gridTile = document.querySelector(".gridTile");
    this.gridTileLevel0 = []; // Tableau tile sol
    this.gridTileLevel1 = []; // Tableau tile niveau 1
    this.gridTileLevel2 = []; // Tableau tile niveau 2
    this.gridTileLevel3 = []; // Tableau tile niveau 3
    this.gridTileDecoration = [];
    
    this.gridPathLevel = [];
    this.gridPlayer = [];
    
    this.backgroundIndexLevel0 = [19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19,
                               19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19];

    this.backgroundIndexLevel1 = [0, 1, 2, 2, 3, 0, 1, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0,
                               0, 15, 6, 6, 16, 0, 15, 6, 6, 6, 16, 0, 0, 0, 0, 0, 0,
                               0, 15, 6, 6, 16, 0, 15, 6, 6, 6, 16, 0, 0, 0, 0, 0, 0,
                               0, 9, 18, 18, 11, 0, 15, 6, 6, 6, 16, 0, 0, 0, 0, 0, 0,
                               0, 12, 17, 17, 14, 0, 15, 6, 6, 6, 16, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 15, 6, 6, 6, 16, 0, 0, 0, 0, 0, 0,
                               1, 2, 2, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 2, 2, 3,
                               15, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 16,
                               15, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 16,
                               15, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 16,
                               9, 18, 18, 18, 18, 18, 6, 6, 6, 6, 6, 18, 18, 18, 18, 18, 11,
                               12, 17, 17, 17, 17, 17, 15, 6, 6, 6, 16, 17, 17, 17, 17, 17, 14,
                               0, 0, 0, 0, 0, 0, 15, 6, 6, 6, 16, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 15, 6, 6, 6, 16, 0, 1, 2, 2, 3, 0,
                               0, 0, 0, 0, 0, 0, 15, 6, 6, 6, 16, 0, 15, 6, 6, 16, 0,
                               0, 0, 0, 0, 0, 0, 15, 6, 6, 6, 16, 0, 9, 18, 18, 11, 0,
                               0, 0, 0, 0, 0, 0, 9, 18, 18, 18, 11, 0, 12, 17, 17, 14, 0];

    this.backgroundIndexLevel2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 0,
                               0, 0, 9, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 11, 0, 0,
                               0, 0, 12, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 14, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.backgroundIndexLevel3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.backgroundIndexDecoration = [0, 52, 0, 0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 52, 0, 0, 52, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 52, 0,
                               0, 4, 0, 0, 0, 0, 0, 0, 46, 0, 0, 0, 0, 0, 0, 8, 0,
                               0, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 52, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 52, 0, 0, 52, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 0, 0, 0, 0, 0,
                               0, 0, 0, 0, 0, 0, 0, 55, 55, 55, 0, 0, 52, 0, 0, 52, 0,
                               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];




    
    
    this.backgroundUrl = ["", "url('IMAGE/TILESET/land_1.png')", "url('IMAGE/TILESET/land_2.png')", "url('IMAGE/TILESET/land_3.png')", "url('IMAGE/TILESET/land_4.png')", "url('IMAGE/TILESET/land_5.png')", "url('IMAGE/TILESET/land_6.png')", "url('IMAGE/TILESET/land_7.png')", "url('IMAGE/TILESET/land_8.png')", "url('IMAGE/TILESET/land_9.png')", "url('IMAGE/TILESET/land_10.png')",
                          "url('IMAGE/TILESET/land_11.png')", "url('IMAGE/TILESET/land_12.png')", "url('IMAGE/TILESET/land_13.png')", "url('IMAGE/TILESET/land_14.png')", "url('IMAGE/TILESET/land_15.png')", "url('IMAGE/TILESET/land_16.png')", "url('IMAGE/TILESET/land_17.png')", "url('IMAGE/TILESET/land_18.png')", "url('IMAGE/TILESET/bg.png')", "url('IMAGE/TILESET/road_1.png')", "url('IMAGE/TILESET/road_2.png')", "url('IMAGE/TILESET/road_3.png')", "url('IMAGE/TILESET/road_4.png')", "url('IMAGE/TILESET/road_5.png')", "url('IMAGE/TILESET/road_6.png')", "url('IMAGE/TILESET/road_7.png')", "url('IMAGE/TILESET/road_8.png')", "url('IMAGE/TILESET/road_9.png')", "url('IMAGE/TILESET/road_10.png')",
                          "url('IMAGE/TILESET/road_11.png')", "url('IMAGE/TILESET/road_12.png')", "url('IMAGE/TILESET/road_13.png')", "url('IMAGE/TILESET/road_14.png')", "url('IMAGE/TILESET/road_15.png')", "url('IMAGE/TILESET/road_16.png')", "url('IMAGE/TILESET/road_17.png')", "url('IMAGE/TILESET/road_18.png')", "url('IMAGE/TILESET/road_19.png')", "url('IMAGE/TILESET/road_20.png')", "url('IMAGE/TILESET/road_21.png')", "url('IMAGE/TILESET/road_22.png')", "url('IMAGE/TILESET/road_23.png')", "url('IMAGE/TILESET/road_24.png')", "url('IMAGE/TILESET/road_25.png')", "url('IMAGE/TILESET/road_26.png')",
                          /*46*/"url('IMAGE/TILESET/decor_1.png')", "url('IMAGE/TILESET/decor_2.png')", "url('IMAGE/TILESET/decor_3.png')", "url('IMAGE/TILESET/decor_4.png')", "url('IMAGE/TILESET/decor_5.png')", "url('IMAGE/TILESET/decor_6.png')", "url('IMAGE/TILESET/decor_7.png')", "url('IMAGE/TILESET/decor_8.png')"/*,"url('IMAGE/TILESET/decor_7_1.png')", "url('IMAGE/TILESET/decor_7_2.png')"*/,
                          /*55*/"url('IMAGE/TILESET/tree_1.png')", "url('IMAGE/TILESET/tree_2.png')", "url('IMAGE/TILESET/tree_3.png')", "url('IMAGE/TILESET/tree_4.png')", "url('IMAGE/TILESET/tree_5.png')", "url('IMAGE/TILESET/tree_6.png')", "url('IMAGE/TILESET/tree_7.png')", "url('IMAGE/TILESET/tree_8.png')", "url('IMAGE/TILESET/tree_9.png')", "url('IMAGE/TILESET/tree_10.png')", "url('IMAGE/TILESET/tree_11.png')", "url('IMAGE/TILESET/tree_12.png')", "url('IMAGE/TILESET/tree_1_1.png')", "url('IMAGE/TILESET/tree_1_2.png')", "url('IMAGE/TILESET/tree_1_3.png')", "url('IMAGE/TILESET/tree_1_4.png')",
                         /**/"url('IMAGE/TILESET/building_1.png')", "url('IMAGE/TILESET/building_2.png')", "url('IMAGE/TILESET/building_3.png')", "url('IMAGE/TILESET/building_4.png')", "url('IMAGE/TILESET/building_5.png')", "url('IMAGE/TILESET/decor_7_1.png')", "url('IMAGE/TILESET/decor_7_2.png')",];
    
    //this.gridTileLevel1 = []; // Tableau tile niveau 1
    this.maxTileGrid = 289;
    
    // Player 1 Map
    this.posTileColorPlayer1 = [143, 142, 141, 140, 139, 138, 137, 136, 119, 102, 103, 104, 105, 106, 107, 108, 91, 74, 57, 40, 23, 6, 7, 8, 9, 10, 27, 44, 61, 78, 95, 112, 113, 114, 115, 116, 117, 118, 135];
    this.posTileBasePlayer1 = [35, 36, 37, 38];
    
    // Player 2 Map
    this.posTileColorPlayer2 = [145, 146, 147, 148, 149, 150, 151, 152, 169, 186, 185, 184, 183, 182, 181, 180, 197, 214, 231, 248, 265, 282, 281, 280, 279, 278, 261, 244, 227, 210, 193, 176, 175, 174, 173, 172, 171, 170, 153];
    this.posTileBasePlayer2 = [250, 251, 252, 253];
    
    // Partie All
    this.posTileBase = [this.posTileBasePlayer1, this.posTileBasePlayer2 ];
    this.allPosTileColor = [...this.posTileColorPlayer1, ...this.posTileColorPlayer2];
    this.allPosWall = [102, 108, 6, 10, 112, 118, 186, 180, 282, 278, 176, 170];
    
    // Player 1 Path
    this.player1MainPath = [136, 119, 102, 103, 104, 105, 106, 107, 108, 91, 74, 57, 40, 23, 6, 7, 8, 9, 10, 27, 44, 61, 78, 95, 112, 113, 114, 115, 116, 117, 118, 135];
    this.player1VictoryPath = [136, 137, 138, 139, 140, 141, 142, 143];
    
    // Blue Path
    this.player2MainPath = [152, 169, 186, 185, 184, 183, 182, 181, 180, 197, 214, 231, 248, 265, 282, 281, 280, 279, 278, 261, 244, 227, 210, 193, 176, 175, 174, 173, 172, 171, 170, 153];
    this.player2VictoryPath = [152, 151, 150, 149, 148, 147, 146, 145];
    
    //const mainPath = [119, 102, 103, 104, 105, 106, 107, 108, 91, 74, 57, 40, 23, 6, 7, 8, 9, 10, 27, 44, 61, 78, 95, 112, 113, 114, 115, 116, 117, 118, 135, 152];
    
    // Player 1 all path
    this.player1Path = [...this.player1MainPath, ...this.player2MainPath, ...this.player1VictoryPath, 144];
    
    // Player 2 all path
    this.player2Path = [...this.player2MainPath, ...this.player1MainPath, ...this.player2VictoryPath, 144];    
    
    this.allPath = [...this.player1Path, ...this.player2Path];
  }

  initializeGrid() {
    this.gridTile.innerHTML = ""; // On vide la grille au départ
    
    // Vider les tableaux au cas où la fonction est relancée
    this.gridTileLevel0.length = 0;
    this.gridTileLevel1.length = 0;
    this.gridTileLevel2.length = 0;
    this.gridTileLevel3.length = 0;

    this.gridPathLevel.length = 0;
    this.gridPlayer.length = 0;
    this.gridTileDecoration.length = 0;
    
    for (let i = 0; i < this.maxTileGrid; i++) {
      
      // Création des éléments HTML <div>
      const tileLevel0 = document.createElement("div");
      const tileLevel1 = document.createElement("div");
      const tileLevel2 = document.createElement("div");
      const tileLevel3 = document.createElement("div");

      const pathLevel = document.createElement("div");
      const tilePlayer = document.createElement("div");
      const tileDecoration = document.createElement("div");
      
      // Ajoute la class CSS sur les grilles
      tileLevel0.classList.add("tileLevel0");
      tileLevel1.classList.add("tileLevel1");
      tileLevel2.classList.add("tileLevel2");
      tileLevel3.classList.add("tileLevel3");

      pathLevel.classList.add("pathLevel");
      tilePlayer.classList.add("tilePlayer");
      /*tileDecoration.classList.add("tileDecoration");*/
      
      // OBLIGATOIRE : Imbrique tout les level DANS le level 0
      tileLevel0.appendChild(tileLevel1);
      tileLevel0.appendChild(tileLevel2);
      tileLevel0.appendChild(tileLevel3);
      tileLevel0.appendChild(pathLevel);
      tileLevel0.appendChild(tilePlayer);
      tileLevel0.appendChild(tileDecoration);
      
      // Ajout dans les tableaux JS pour y accéder plus tard
      this.gridTileLevel0.push(tileLevel0);
      this.gridTileLevel1.push(tileLevel1);
      this.gridTileLevel2.push(tileLevel2);
      this.gridTileLevel3.push(tileLevel3);
      this.gridPathLevel.push(pathLevel);
      this.gridPlayer.push(tilePlayer);
      this.gridTileDecoration.push(tileDecoration);
      
      // Injection de la tuile de sol (qui contient déjà le niveau 1) dans la grille principale
      this.gridTile.appendChild(tileLevel0);
    }
  }

  addBackgroundTileGrid(){
    
   // Grid 0 Sol
   for( let i= 0; i < this.gridTileLevel0.length; i++){
      this.gridTileLevel0[i].style.backgroundImage = this.backgroundUrl[this.backgroundIndexLevel0[i]];
    } 

    // Grid 1 Escalier
    for( let i= 0; i < this.gridTileLevel1.length; i++){
      this.gridTileLevel1[i].style.backgroundImage = this.backgroundUrl[this.backgroundIndexLevel1[i]];
    }
    
    // Grid 2
    for( let i= 0; i < this.gridTileLevel2.length; i++){
      this.gridTileLevel2[i].style.backgroundImage = this.backgroundUrl[this.backgroundIndexLevel2[i]];
    }
    
    // Grid 3
    for( let i= 0; i < this.gridTileLevel3.length; i++){
      this.gridTileLevel3[i].style.backgroundImage = this.backgroundUrl[this.backgroundIndexLevel3[i]];
    }
    
    // Grid Path
    for( let i= 0; i < this.allPath.length; i++){
      this.gridPathLevel[this.allPath[i]].style.border = "0.5px black solid";
    }

    // Grid Decoration
    for( let i= 0; i < this.gridTileDecoration.length; i++){
      
      if(this.backgroundIndexDecoration[i] >= 55 && this.backgroundIndexDecoration[i] <= 66){
        this.gridTileDecoration[i].classList.add("tileDecorationFat");
      }    
      else{
        this.gridTileDecoration[i].classList.add("tileDecorationLittle");
      }
  
      this.gridTileDecoration[i].style.backgroundImage = this.backgroundUrl[this.backgroundIndexDecoration[i]];
    }
  }  
}
