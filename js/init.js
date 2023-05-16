const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasUI = document.getElementById('gameUICanvas');
const ctxUI = canvasUI.getContext('2d');
var player;
var lang = "ru";
let resources = {};

document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});

function initGame(params) {
    YaGames.init().then(ysdk => {
        ysdk.getPlayer().then(_player => {
            player = _player;
            lang = ysdk.environment.i18n.lang;
            loadLanguageScript(lang);
        }).catch(err => {
            console.log('Ошибка при инициализации объекта Player: ', err);
        });
    })

    function preloadResources(url, filename, object) { // функция для загрузки изображений
        return new Promise((resolve, reject) => {
            let resource = object;
            resource.onload = resolve;
            resource.onerror = reject;
            resource.src = url;
            resources[filename] = resource;
        });
    }
    

    // список ресурсов для загрузки
    let resourceUrls = [
        { "url": './assets/art/ui/ui.png', "filename": "ui", "type": "image" },
        { "url": './assets/art/background/Background.png', "filename": "background", "type": "image"},
        { "url": './assets/art/background/Tileset.png', "filename": "tileset", "type": "image"},
        { "url": './assets/art/dinosaurs/3_Diplodocus/player.png', "filename": "diplodocus_p", "type": "image" },
        { "url": './assets/art/dinosaurs/3_Diplodocus/enemy.png', "filename": "diplodocus_e", "type": "image" },
        { "url": './assets/sound/Sounds-Music-NES/Intro Jingle.wav', "filename": "music", "type": "audio" },
    ];

    
    let promises = []; // массив для Promise

    resourceUrls.forEach((resource) => {
        if (resource.type !== "audio") {
            promises.push(preloadResources(resource.url, resource.filename, new Image())); // добавление каждого Promise в массив
        } else {
            preloadResources(resource.url, resource.filename, new Audio());
        }
        
    });

    Promise.all(promises) // ожидание разрешения всех Promise
        .then(() => {
            console.log('Все ресурсы загружены.');
            YaGames
                .init(params)
                .then(ysdk => {
                    ysdk.features.LoadingAPI?.ready();
                })
                .catch(console.error);
            // здесь можно начать игру или сделать что-то еще после загрузки всех ресурсов
            startGame();
        })
        .catch((er) => {
            console.log('Ошибка загрузки ресурсов:', er);
        });
}

initGame();

