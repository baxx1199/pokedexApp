let pokemons = [];
let pokemonsObjets =[]

/* const searchForId = document.getElementById('filterforId'); */

const coolors = {
    fire: '#FDDFDF',
    grass:'#DEFDE0',
    electric:'#FCF7DE',
    water:'#DEF3FD',
    ground:'#f4e7da',
    rock:'#d5d5d4',
    fairy:'#fceaff',
    poison:'#98d7a5',
    bug:'#fBd5a3',
    dragon:'#97b3e6',
    psychic:'#eaedc1',
    flying:'#F5F5F5',
    fighting:'#E6E0D4',
    normal:'#F5F5F5',
    ice: '#afe5e7'
}

const colorType = Object.keys(coolors);


//obtener los datos mediente fetch

let onAir = 1 ;

const charge= ()=>{
    const promises = [];
    for (let i = 1; i <= 151; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url)
            .then((response) => response.json())
        );
    }
        
    Promise.all(promises).then((value)=>{
        const pokemonsRes = value.map((responsePokemons)=>({
            name:responsePokemons.name,
            id:responsePokemons.id,
            sprite: responsePokemons.sprites['front_default'],
            types: responsePokemons.types.map(type => type.type.name).join(", "),
            stats: responsePokemons.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}\n`),
            height: (responsePokemons.height/10),
            weight: (responsePokemons.weight/10)

        }));
        console.log(pokemonsRes)
        pokemons = pokemonsRes.map(pokemon => createPokemonInner(pokemon)).join("")
        pokemonsObjets.push(pokemonsRes)
        renderPokemons()
    });
    
}

const createPokemonInner =(pokemon)=>{
    const type = colorType.find(type => pokemon.types.indexOf(type)> -1);

    let pokemonInfoHTML = `<li class="pokemonCard ${type}" onclick="seeInfo(${pokemon.id})" >
    
            <h2 class="info">#${pokemon.id.toString().padStart(3, '0')} <span> ${pokemon.name} </span></h2>
            <div class="imgContainer">
                <img src="${pokemon.sprite}" alt="${pokemon.name}'s sprite">
            </div>
        </li>`;
        
    return pokemonInfoHTML;
}
const renderPokemons = ()=>{
    document.getElementById('list').innerHTML = pokemons;
    console.log('ready')
}


const seeInfo=(idNum)=>{
    let pokemon = pokemonsObjets[0].find(poke => poke.id === idNum);
    let types = pokemon.types.split(', ');
    let formatType = '';
    if (types[1]==undefined) {
        types.slice(1,1);
        formatType=`<span class="spanType firstType ${types[0]}">${types[0]}</span>`
    }else{
        formatType = `<span class="spanType firstType ${types[0]}">${types[0]}</span><span class="spanType secondType ${types[1]}">${types[1]}</span>`
    }
    
    document.getElementById('pokedexScreen').innerHTML = `<img class="spritePokeDex" src="${pokemon.sprite}" alt="${pokemon.name}'s sprite">`
    document.getElementById('idScreen').innerHTML = `<h2 class="idPokemonLeft">#${pokemon.id.toString().padStart(3, '0')}</h2>`
    document.getElementById('screenInfo').innerHTML = ` <div class="divInfo">
        <h2 class="name_id">#${pokemon.id.toString().padStart(3, '0')} ${pokemon.name}</h2>
       <small class="infoType">Tipo:${formatType}</small>
       <h2 class="stt">stats</h2>
       <ul class="stats">
        <li>${pokemon.stats[0]}</li>
        <li>${pokemon.stats[1]}</li>
        <li>${pokemon.stats[2]}</li>
        <li>${pokemon.stats[3]}</li>
        <li>${pokemon.stats[4]}</li>
        <li>${pokemon.stats[5]}</li>
       </ul>
       
       <small class="infoForm"><span class="form">Tamaño:</span> ${pokemon.height} mts  <span class="form">Peso:</span>${pokemon.weight} kg</small>
        </div>
       ` 
       onAir = pokemon.id;

}


const searchPokemon = ()=>{
    let seekPokemonforName= document.getElementById('filterforName');
    let seekPokemonforId= document.getElementById('filterforId');
    let pokemonLocated ="''"
    console.log('id'+seekPokemonforId.value +' name'+seekPokemonforName.value)
    if (seekPokemonforName.value !== ""|| seekPokemonforId.value !== "") {
        if (seekPokemonforName.value!=="") {
            pokemonLocated = pokemonsObjets[0].find(poke => poke.name == seekPokemonforName.value);
            seeInfo(pokemonLocated.id)
        } else if(seekPokemonforId.value!=null){
            pokemonLocated = pokemonsObjets[0].find(poke => poke.id == seekPokemonforId.value);
            seeInfo(pokemonLocated.id)
        }   
    }else{
        alert('Debe ingresar algun dato')
    }

    
    cleanArea(seekPokemonforName, seekPokemonforId)
}

function cleanArea (a,b){
    a.value = ""
    b.value = ""
    return a.value , b.value;
}
function next (){
    if (onAir < 151) {
        seeInfo(++onAir);
    }else if (onAir >= 151){
        seeInfo(1);
    }
}
function previous (){
    if (onAir > 1) {
        seeInfo(--onAir);
    }else if (onAir <= 1){
        seeInfo(151);
    }
}
function currently (){
    seeInfo(onAir)
}

