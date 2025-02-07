"use strict"
/*if (b4w.module_check("my_project"))
    throw "Failed to register module: my_project_main";*/
// register the application module
import b4w from "blend4web";
//import * as b4w from "./b4web.min.js";
var m_app = b4w.app;
var m_cfg = b4w.config;
var m_data = b4w.data;
var m_preloader = b4w.preloader;
var m_ver = b4w.version;
var m_anim = b4w.animation;
var m_cont = b4w.container;
var m_ctl = b4w.controls;
var m_mouse = b4w.mouse;
var m_math = b4w.math;
var m_obj = b4w.objects;
var m_phy = b4w.physics;
var m_scenes = b4w.scenes;
var m_trans = b4w.transform;


var m_main = b4w.main;
var m_quat = b4w.quat;

var m_const = b4w.constraints;
// ЗВУК
//var m_speaker = require("speaker");
//var _strikeSound;
var m_sfx = b4w.sfx;
var m_time = b4w.time;
var m_hmd = b4w.hmd;
var m_cam = b4w.camera;

//b4w.register("my_project_main", function (exports, require) {

    // import modules used by the app
    /*var m_app = require("app");
    var m_cfg = require("config");
    var m_data = require("data");
    var m_preloader = require("preloader");
    var m_ver = require("version");
    var m_anim = require("animation");
    var m_cont = require("container");
    var m_ctl = require("controls");
    var m_mouse = require("mouse");
    var m_math = require("math");
    var m_obj = require("objects");
    var m_phy = require("physics");
    var m_scenes = require("scenes");

    var m_trans = require("transform");

    
    var m_main = require("main");
    var m_quat = require("quat");

var m_const = require("constraints");
// ЗВУК
//var m_speaker = require("speaker");
//var _strikeSound;
var m_sfx = require("sfx");
var m_time = require("time");
var m_hmd = require("hmd");
var m_cam = require("camera");//b4w.camera;*/

var parent_pos = new Float32Array();
var DEBUG = (m_ver.type() == "DEBUG");


var _drag_mode = false;
var _enable_camera_controls = true;

var _first_Click = false;
var _selected_obj = null;
var _moving_obj = null;
var _previev_obj = null;
var _enable_click = false;
var _d_id = 0;

//var OUTLINE_COLOR_VALID = [0, 1, 0];
//var OUTLINE_COLOR_ERROR = [1, 0, 0];
var FLOOR_PLANE_NORMAL = [0, 0, 1];

//var ROT_ANGLE = Math.PI / 4;

var WALL_X_MAX = 1.0;
var WALL_X_MIN = -1.0;//-3.8;
var WALL_Z_MAX = 4.2;
var WALL_Z_MIN = -1.065;//-3.5;    

var _obj_delta_xy = new Float32Array(2);
//var spawner_pos = new Float32Array(3);
var _vec3_tmp = new Float32Array(3);
var _vec3_tmp2 = new Float32Array(3);
var _vec3_tmp3 = new Float32Array(3);
var _vec4_tmp = new Float32Array(4);
var _pline_tmp = m_math.create_pline();

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("my_project");


//var _TxBow_X;
// Создаём объект Audio
var audio = new Audio(APP_ASSETS_PATH + "Foul.mp3");
var audioRunBall = new Audio(APP_ASSETS_PATH + "BallRun01.mp3");
var audioKegli = new Audio(APP_ASSETS_PATH + "Kegli.mp3");
var audioFinal = new Audio(APP_ASSETS_PATH + "Final01.mp3");
var audioStrike = new Audio(APP_ASSETS_PATH + "Strike01.mp3");
var audioMusic01 = new Audio(APP_ASSETS_PATH + "Music01.mp3");
var audioMusic02 = new Audio(APP_ASSETS_PATH + "Music02.mp3");
var _last_posX_R = 0.0;
var _last_posX_L = 0.0;//1100.0;
//var _last_posY_B = 0.0;
//var _last_posY_F = 500.0;
//var _last_posY = 0.0;    
//var n_X = 0.0;
//var n_Y = 0.0;


var move = false;
var move_2 = false;
var m_Pins_arr1 = [];
var m_Pins_arr2 = [];
var m_Pins_arr3 = [];
var m_Pins_arr4 = [];
var m_Pins_arr5 = [];
var m_Pins_arr6 = [];
var m_Pins_arr7 = [];
var m_Pins_arr8 = [];
var m_Pins_arr9 = [];
var m_Pins_arr10 = [];
var m_pins_onPlos = [];
var numDownPins = [];
var not_select = false;
var prev_positions = {}; // Сохраняет предыдущие позиции объектов
var prev_rotations = {}; // Сохраняет предыдущие ориентации объектов
var all_bowl = ["Bowling Ball", "Bowling Ball02Green", "Bowling Ball03Blue", "Bowling Ball07", "Bowling Ball09"];
var all_znak = ["X", "Tire", "Slash", "F"];
var pos_all_hide_bowl = [5.62, -12.82, -0.63];
// var m_vec3 = new Float32Array(3);
/**
 * export the method to initialize the app (called at the bottom of this file)
 */

//#Bowling_Schet = 0
var Schet_0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var Game = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
var _Place = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
var Total = 0;
var LastShot = false;
var BestResult = 0;
var TxName = 0;
var TxFrame = 0;

var tTol = 0;
//var CameraSteering = False;
var Prop_PlaceInFrame = [[11, 12], [21, 22], [31, 32], [41, 42], [51, 52], [61, 62], [71, 72], [81, 82], [91, 92], [101, 102], [111, 0]];
var NumBroska_Player = 0;
var Player_PlaceInFrame = 0;
var Player_NumFrame = 0;
var CountFirst = 0;
var CountSecond10 = 0;
var own_dobavka = 0;
var ResetPins = false;
var FrameTrue = 1;//# Когда будет кнопка NewGame, здесь должен быть 0
var TextVisualClasic = true;
var own_countPinPad = null;
var _Break = false;
var EndGame = true;
var GameBegin = false;//Score
var full_screen = false;
var _zvuk = true;
var zvk = 0;
/////////////////////////////////////////////

    /*exports.init = function () {
        m_app.init({
            canvas_container_id: "main_canvas_container",
            callback: init_cb,
            //show_fps: DEBUG,
            physics_enabled: true,
            physics_use_wasm: true,
            physics_use_workers: true,
           //console_verbose: DEBUG,

            autoresize: true
        });
}*/
function init() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        //show_fps: DEBUG,
        //console_verbose: DEBUG,
        physics_enabled: true,
        physics_use_wasm: true,
        physics_use_workers: true,
        autoresize: true
    });
}

    /**
     * callback executed when the app is initialized 
     */
    function init_cb(canvas_elem, success) {
       //console.log("function init_cb");
        if (!success) {
           //console.log("b4w init failure");
            return;
        }

        m_preloader.create_preloader();

        // ignore right-click on the canvas element
        canvas_elem.oncontextmenu = function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        load();
    }

    /**
     * load the scene data
     */
    function load() {
        //m_data.load(APP_ASSETS_PATH + "my_project.json", load_cb, preloader_cb);
        var preloader_cont = document.getElementById("preloader_cont");
        preloader_cont.style.visibility = "visible";
        if (window.web_page_integration_dry_run)
            m_data.load(APP_ASSETS_PATH + "my_project.json", load_cb, preloader_cb);
       //console.log("function load");
    }

    /**
     * update the app's preloader
     */
    function preloader_cb(percentage) {
        


        var prelod_dynamic_path = document.getElementById("prelod_dynamic_path");
        var percantage_num = prelod_dynamic_path.nextElementSibling;

        prelod_dynamic_path.style.width = percentage + "%";
        percantage_num.innerHTML = percentage + "%";
        if (percentage == 100) {
            var preloader_cont = document.getElementById("preloader_cont");
            preloader_cont.style.visibility = "hidden";
            m_preloader.update_preloader(percentage);
            return;
        }
        
    }

    function init_controls() {
        /*document.getElementById("myonoffswitch").checked = false;
    <div class="onoffswitch" onclick= fullscreen()>
        <div id="myonoffswitch"></div>
    </div>*/
       //console.log("init_controls Begin OK");
        var controls_elem = document.getElementById("controls-container");
        controls_elem.style.display = "block";

        init_buttons();
       
        document.getElementById("load-1").addEventListener("click", function () {
            // Меняем изображение background-image
            //this.style.backgroundImage = ""; // Убираем старое изображение
            if (EndGame && !GameBegin && !not_select) {  // Меняем изображение на новое
                this.style.backgroundImage = "url('./assets/Balls/SelectBall.png')";
                //_Game();
                GameBegin = true;
                EndGame = false;
                _Game_begin();
               //console.log("GameBegin = " + GameBegin);
                _showImage();
                
                
            }
        });

        document.getElementById("load-2").addEventListener("click", function (e) {
            if (!EndGame && GameBegin && !not_select && !_enable_click) {
                //document.getElementById("load-2").setAttribute("data-after","sdsf");
                selectBall("Bowling Ball", "Bowling BallAction");
                _enable_click = true;
            //this.classList.toggle("show-before");
            }
        });

        document.getElementById("load-3").addEventListener("click", function (e) {
            if (!EndGame && GameBegin && !not_select && !_enable_click) {
                selectBall("Bowling Ball02Green", "Bowling BallAction");
                _enable_click = true;
            //this.classList.toggle("show-before");
            }
        });

        document.getElementById("load-4").addEventListener("click", function (e) {
            if (!EndGame && GameBegin && !not_select && !_enable_click) {
                selectBall("Bowling Ball03Blue", "Bowling BallAction");
                _enable_click = true;
            }
        });

        document.getElementById("load-5").addEventListener("click", function (e) {
            if (!EndGame && GameBegin && !not_select && !_enable_click) {
                selectBall("Bowling Ball07", "Bowling BallAction");
                _enable_click = true;
            }               
        });

        document.getElementById("load-6").addEventListener("click", function (e) {
            if (!EndGame && GameBegin && !not_select && !_enable_click) {
                selectBall("Bowling Ball09", "Bowling BallAction");
                _enable_click = true;
            }               
        });

        document.getElementById("load-7").addEventListener("click", function (e) {
           //console.log("fullscreen");
            var m_screen = b4w.screen;// require("screen");
            //m_hmd.enable_hmd(m_hmd.HMD_ALL_AXES_MOUSE_YAW);
            //m_screen.request_fullscreen();
            
            if (!full_screen)
                _enable_fullsrc(m_screen, document.body);
            else
                _desable_fullsrc(m_screen);

        });

    }
    function _showImage() {

        var elem2 = document.getElementById("load-2");
            // Переключаем класс show-before
        elem2.classList.toggle("show-before");
        var elem3 = document.getElementById("load-3");

        elem3.classList.toggle("show-before");
        var elem4 = document.getElementById("load-4");

        elem4.classList.toggle("show-before");        
        var elem5 = document.getElementById("load-5");

        elem5.classList.toggle("show-before");
        var elem6 = document.getElementById("load-6");

        elem6.classList.toggle("show-before");
    }
    function _enable_fullsrc(m_screen, db) {
        var elem = document.getElementById("load-7");
        m_screen.request_fullscreen_hmd(db); //_hmd
        elem.style.backgroundImage = "url('./assets/Balls/full_scr_inv.png')";
        full_screen = true;
        //console.log("m_screen = " + m_screen);
    }
    function _desable_fullsrc(m_screen) {
        if (full_screen) {
            var elem = document.getElementById("load-7");
            elem.style.backgroundImage = "url('./assets/Balls/full_scr.png')";
            m_screen.exit_fullscreen_hmd();

            full_screen = false;
        }

    }

    function _Game_begin() {
        //_zvuk = true;
        //zvk = 0;
        /*function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        if (zvk==0)
            zvk = getRandomInt(1, 2);*/
        zvk += 1;
        if (_zvuk) {            
            if (zvk % 2 != 0) {
                //if (zvk == 1)
                playMusic01();
            }
            else {
                //if (zvk == 2)
                    playMusic02();
            }
            
        }
            
        _begin_first_anim(30, 69);
        for (var j = 1; j < 30; j++) {
            var obname = "Tx" + j;
            //console.log("obname =" + obname);
            if (m_scenes.check_object_by_name(obname, 0)) {
                var lastob = m_scenes.get_object_by_name(obname);
                //console.log("obname =" + lastob);
                m_scenes.remove_object(lastob);
                //m_scenes.hide_object(lastob);
            }
        }
        for (var j1 = 0; j1 < 4; j1++) {
            var obname = "Tx" + all_znak[j1];
            //console.log("obname =" + obname);
            if (m_scenes.check_object_by_name(obname, 0)) {
                var lastob = m_scenes.get_object_by_name(obname);
                //console.log("obname =" + lastob);
                m_scenes.remove_object(lastob);
                //m_scenes.hide_object(lastob);
            }
        }

        for (var j = 1; j < TxFrame + 1; j++) {
            var _new = "TxT" + j;
            //console.log("_new =" + _new);
            if (m_scenes.check_object_by_name(_new, 0)) {
                var lastob = m_scenes.get_object_by_name(_new);
                //console.log("_new =" + lastob);
                m_scenes.remove_object(lastob);
                //m_scenes.hide_object(lastob);
            }
        }
        for (var j = 0; j < tTol + 1; j++) {
            var _newT = "TxTotal" + j;

            if (m_scenes.check_object_by_name(_newT, 0)) {
                var lastob = m_scenes.get_object_by_name(_newT);
                m_scenes.remove_object(lastob);
                //m_scenes.hide_object(lastob);
            }
        }
        // Зеленая точка
        //const TocPosFirst01 = 1.84584;
        var obt = m_scenes.get_object_by_name("OverFrame");//(FrameTrue - 1)
        m_scenes.show_object(obt);
        m_trans.set_translation(obt, 1.84584, -11.11572, 0.877849);

        var obL = m_scenes.get_object_by_name("Over_10_Frame");
        m_scenes.show_object(obL);
        var obT = m_scenes.get_object_by_name("Total");
        m_scenes.hide_object(obT);
        var obS = m_scenes.get_object_by_name("Score");
        m_scenes.hide_object(obS);
        var obG = m_scenes.get_object_by_name("GameOver");
        m_scenes.hide_object(obG);
        _game_over();
        Schet_0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        Game = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        _Place = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        Total = 0;
        LastShot = false;
        BestResult = 0;
        TxName = 0;
        TxFrame = 0;

        tTol = 0;
        Prop_PlaceInFrame = [[11, 12], [21, 22], [31, 32], [41, 42], [51, 52], [61, 62], [71, 72], [81, 82], [91, 92], [101, 102], [111, 0]];
        NumBroska_Player = 0;//16;//16
        Player_PlaceInFrame = 0;
        Player_NumFrame = 0;
        CountFirst = 0;
        CountSecond10 = 0;
        own_dobavka = 0;
        ResetPins = false;
        FrameTrue = 1;//9;//# Когда будет кнопка NewGame, здесь должен быть 0
        TextVisualClasic = true;
        own_countPinPad = null;
        _Break = false;
        _enable_click = false;
    }

    function _beginFinal() {

        _begin_first_anim(1, 30);
        var obT = m_scenes.get_object_by_name("Total");
        m_scenes.hide_object(obT);
        var obS = m_scenes.get_object_by_name("Score");
        m_scenes.show_object(obS);
       //console.log("44 GameBegin = " + GameBegin);
        var obG = m_scenes.get_object_by_name("GameOver");
        m_scenes.show_object(obG);
        // Зеленая точка
        var obt = m_scenes.get_object_by_name("OverFrame");
        m_scenes.hide_object(obt);
        if(_zvuk)
            playFinalSound();
        _game_over();
        _showImage();
    }


    function _game_over() {
        var obG = m_scenes.get_object_by_name("GameOver");
        var count = 0;
        // function creation setInterval
        var interval = setInterval(function () {
            if (EndGame == true) {
                count += 1;
                if (count % 2 == 0)
                    m_scenes.hide_object(obG);
                else
                    m_scenes.show_object(obG);
            }
            else
                clearInterval(interval);
        }, 300);
    }
///////////////////////////////////////////


//////////////////////////////////////////////    
    function selectBall(_nameOb, _nameAnim) {
        //m_data.load("blend_data/Bowling Ball00.json", loaded_cb, null, null, true);
        var targ = m_scenes.get_object_by_name(_nameOb);
        var m_vec3 = b4w.vec3;//
        var _vec3_tmp = m_vec3.create();
        _d_id++;
        if (_d_id > 1) {
            //m_scenes.hide_object(_previev_obj);
            m_phy.disable_simulation(_previev_obj);
           //console.log("if (_d_id > 1) {");
            m_trans.set_translation_v(_previev_obj, pos_all_hide_bowl);//4.0, -12.0, -0.67);
            m_scenes.hide_object(_previev_obj);
        }
        m_phy.disable_simulation(targ);
        //m_trans.set_rotation_euler(targ, 0, 0, 0);

        //m_scenes.show_object(targ);
        // Применить анимацию "Pin_Down"
        m_anim.apply(targ, _nameAnim, m_anim.SLOT_0);
        // Задать начальный кадр
        m_anim.set_frame(targ, 160);
        _first_Click = false;
        // Воспроизвести анимацию с ограничением диапазона кадров
        function play_animation_with_range(targ, start_frame, end_frame) {
            m_scenes.show_object(targ);
            m_anim.set_frame(targ, start_frame);
            m_anim.play(targ);

            var check_frame = function () {
                var current_frame = m_anim.get_frame(targ);

                if (current_frame > end_frame) {
                    m_anim.stop(targ);

                    var translation = m_trans.get_translation(targ, _vec3_tmp);

                    m_anim.remove(targ);
                    m_anim.remove_slot_animation(targ, m_anim.SLOT_0)
                    // Бывший шар уберем
                    Ball_TakePlace(_d_id, targ, translation);
                    //_enable_click = false;

                } else {
                    requestAnimationFrame(check_frame);
                }
            };
            check_frame();
        }

        play_animation_with_range(targ, 160, 189);
    }
    // Бывший шар уберем
    function Ball_TakePlace(_id, ob, translation) {

        _selected_obj = null;
        _moving_obj = null;

        m_trans.set_translation(ob, translation[0], translation[1], translation[2]);
        _previev_obj = ob;
        _enable_click = false;
        var id = m_scenes.get_object_data_id(ob);

    }
    function init_buttons() {
        var ids = ["delete", "rot-ccw", "rot-cw"];

        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];

            document.getElementById(id).addEventListener("mousedown", function (e) {
                var parent = e.target.parentNode;
                parent.classList.add("active");
            });
            document.getElementById(id).addEventListener("mouseup", function (e) {
                var parent = e.target.parentNode;
                parent.classList.remove("active");
            });
            document.getElementById(id).addEventListener("touchstart", function (e) {
                var parent = e.target.parentNode;
                parent.classList.add("active");
            });
            document.getElementById(id).addEventListener("touchend", function (e) {
                var parent = e.target.parentNode;
                parent.classList.remove("active");
            });

        }
        if (document.addEventListener) {
            document.addEventListener('webkitfullscreenchange', exitHandler, false);
            document.addEventListener('mozfullscreenchange', exitHandler, false);
            document.addEventListener('fullscreenchange', exitHandler, false);
            document.addEventListener('MSFullscreenChange', exitHandler, false);
        }

    }
    function exitHandler() {
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
           //console.log("Нажата Esc – exitFullscreen");
            var m_screen = b4w.full_screen;//require("screen");
            if (full_screen) {
                _desable_fullsrc(m_screen);
            }
        }
    }

    /**
     * callback executed when the scene data is loaded
     */
    function load_cb(data_id, success) {
       //console.log("function load_cb");
        if (!success) {
           //console.log("b4w load failure");
            return;
        }

        m_app.enable_camera_controls();
        init_controls();
        // place your code here
        var canvas_elem = m_cont.get_canvas();

        //canvas_elem.addEventListener("mousedown", main_canvas_click, false);
        //canvas_elem.addEventListener("touchstart", main_canvas_click, false);

        canvas_elem.addEventListener("mousedown", main_canvas_down);
        canvas_elem.addEventListener("touchstart", main_canvas_down);

        canvas_elem.addEventListener("mousemove", main_canvas_move);
        canvas_elem.addEventListener("touchmove", main_canvas_move);

        canvas_elem.addEventListener("mouseup", main_canvas_up);
        canvas_elem.addEventListener("touchend", main_canvas_up);

        window.onresize = m_cont.resize_to_container;
        m_cont.resize_to_container();
        //load();

        ////   Позиции пустышек для кеглей
        var m_vec3 = b4w.vec3;
        var _vec3_tmp = m_vec3.create();
        //var translation = m_trans.get_translation(obj, _vec3_tmp);

        var pin1_empty = m_scenes.get_object_by_name("EmptyPin1");
        var EmptyPin1_pos = m_vec3.create();
        var pin1Trans = m_trans.get_translation(pin1_empty, EmptyPin1_pos);
        console.log("pin1Trans=" + pin1Trans);
        
        //m_Pins_arr1 = [...m_Pins_arr1, pin1Trans];
        m_Pins_arr1.push(pin1Trans);
        console.log("m_Pins_arr1=" + m_Pins_arr1);

        var pin2_empty = m_scenes.get_object_by_name("EmptyPin2");
        var EmptyPin2_pos = m_vec3.create();
        var pin2Trans = m_trans.get_translation(pin2_empty, EmptyPin2_pos);
        m_Pins_arr2.push(pin2Trans);

        var pin3_empty = m_scenes.get_object_by_name("EmptyPin3");
        var EmptyPin3_pos = m_vec3.create();
        var pin3Trans = m_trans.get_translation(pin3_empty, EmptyPin3_pos);
        //m_Pins_arr3 = [...m_Pins_arr3, pin3Trans];
        m_Pins_arr3.push(pin3Trans);

        var pin4_empty = m_scenes.get_object_by_name("EmptyPin4");
        var EmptyPin4_pos = m_vec3.create();
        var pin4Trans = m_trans.get_translation(pin4_empty, EmptyPin4_pos);
        //m_Pins_arr4 = [...m_Pins_arr4, pin4Trans];
        m_Pins_arr4.push(pin4Trans);

        var pin5_empty = m_scenes.get_object_by_name("EmptyPin5");
        var EmptyPin5_pos = m_vec3.create();
        var pin5Trans = m_trans.get_translation(pin5_empty, EmptyPin5_pos);
        //m_Pins_arr5 = [...m_Pins_arr5, pin5Trans];
        m_Pins_arr5.push(pin5Trans);

        var pin6_empty = m_scenes.get_object_by_name("EmptyPin6");
        var EmptyPin6_pos = m_vec3.create();
        var pin6Trans = m_trans.get_translation(pin6_empty, EmptyPin6_pos);
        //m_Pins_arr6 = [...m_Pins_arr6, pin6Trans];
        m_Pins_arr6.push(pin6Trans);

        var pin7_empty = m_scenes.get_object_by_name("EmptyPin7");
        var EmptyPin7_pos = m_vec3.create();
        var pin7Trans = m_trans.get_translation(pin7_empty, EmptyPin7_pos);
        //m_Pins_arr7 = [...m_Pins_arr7, pin7Trans];
        m_Pins_arr7.push(pin7Trans);

        var pin8_empty = m_scenes.get_object_by_name("EmptyPin8");
        var EmptyPin8_pos = m_vec3.create();
        var pin8Trans = m_trans.get_translation(pin8_empty, EmptyPin8_pos);
        //m_Pins_arr8 = [...m_Pins_arr8, pin8Trans];
        m_Pins_arr8.push(pin8Trans);

        var pin9_empty = m_scenes.get_object_by_name("EmptyPin9");
        var EmptyPin9_pos = m_vec3.create();
        var pin9Trans = m_trans.get_translation(pin9_empty, EmptyPin9_pos);
        //m_Pins_arr9 = [...m_Pins_arr9, pin9Trans];
        m_Pins_arr9.push(pin9Trans);

        var pin10_empty = m_scenes.get_object_by_name("EmptyPin10");
        var EmptyPin10_pos = m_vec3.create();
        var pin10Trans = m_trans.get_translation(pin10_empty, EmptyPin10_pos);
        //m_Pins_arr10 = [...m_Pins_arr10, pin10Trans];
        m_Pins_arr10.push(pin10Trans);

        // Кегли
        for (var i = 1; i <= 10; i++) {
            var pin_name = 'Pin' + i;
            prev_positions[pin_name] = [0, 0, 0];
            prev_rotations[pin_name] = m_quat.create(); // Используем для кватернионов
        }
        // Находим объект "TxBow_X"
        var _TxBow_X = m_scenes.get_object_by_name("TxBow_X");
        // Прячем "TxBow_X" при загрузке
        m_scenes.hide_object(_TxBow_X, false);
        _begin_first_anim(1, 30);
    }


    //#################   звук   ############################################
    function show_Strike(num) {
        // Показать Spare или Strike
        var _Spare = "";
        if (num == "Slash")
            _Spare = m_scenes.get_object_by_name("Spare");
        if (num == "X")
            _Spare = m_scenes.get_object_by_name("Strike");
        m_scenes.show_object(_Spare, false);

        // Через 600 мс  спрятать Spare или Strike
        m_time.set_timeout(function () {

            m_scenes.hide_object(_Spare, false);
        }, 600);
    }
    function stopMusic01() {
        audioMusic01.pause(); // Приостанавливаем звук
        //audioMusic01.currentTime = 0; // Сбрасываем время воспроизведения на начало
    }
    function stop_End_Music01() {
        audioMusic01.pause(); // Приостанавливаем звук
        audioMusic01.currentTime = 0; // Сбрасываем время воспроизведения на начало
        //zvk = 0;
    }
    // Функции для воспроизведения звука Music01
    function playMusic01() {
        if (_zvuk)
            audioMusic01.loop = true;
            audioMusic01.play().catch(function (error) {
                //console.error("Ошибка воспроизведения аудио:", error);
            });
    }
    function stopMusic02() {
        audioMusic02.pause(); // Приостанавливаем звук
        //audioMusic01.currentTime = 0; // Сбрасываем время воспроизведения на начало
    }
    function stop_End_Music02() {
        audioMusic02.pause(); // Приостанавливаем звук
        audioMusic02.currentTime = 0; // Сбрасываем время воспроизведения на начало
        //zvk = 0;
    }
    // Функции для воспроизведения звука Music01
    function playMusic02() {
        if (_zvuk)
            audioMusic02.loop = true;
        audioMusic02.play().catch(function (error) {
            //console.error("Ошибка воспроизведения аудио:", error);
        });
    }
    // Функции для воспроизведения звука audioFinal audioStrike
    function playStrikeSound(num) {
        if (_zvuk)
            audioStrike.play().catch(function (error) {
           //console.error("Ошибка воспроизведения аудио:", error);
            });
        show_Strike(num);
    }
    function playFinalSound() {
       // if (_zvuk)       
            audioFinal.play().catch(function (error) {
           //console.error("Ошибка воспроизведения аудио:", error);
            });
        if (zvk % 2 != 0)
            stop_End_Music01();
        if (zvk % 2 == 0)
            stop_End_Music02();
       //console.log("fin");
    }
    function playFoulSound() {
        //if (_zvuk)
            audio.play().catch(function (error) {
           //console.error("Ошибка воспроизведения аудио:", error);
            });
    }
    function playRunBallSound() {
        //if (_zvuk)
            audioRunBall.play().catch(function (error) {
           //console.error("Ошибка воспроизведения аудио:", error);
            });
    }
    function playKegliSound() {
        if (_zvuk) {
            for (var i = 1; i <= 10; i++) {
                var pin_name = 'Pin' + i;
                var ob = m_scenes.get_object_by_name(pin_name);
                var coll_sensor = m_ctl.create_collision_sensor(ob, "", true);
                m_ctl.create_sensor_manifold(ob, "PIN" + i, m_ctl.CT_SHOT, [coll_sensor], null, playKegli);
            }
        }

    }

    function playKegli() {
        if (_zvuk)
            audioKegli.play().catch(function (error) {
           //console.error("Ошибка воспроизведения аудио:", error);
            });
    }
    /*function stopKegliSound() {
        audioKegli.pause(); // Приостанавливаем звук
        audioKegli.currentTime = 0; // Сбрасываем время воспроизведения на начало
    }*/
    // Функции для остановки звука
    function stopFoulSound() {
        audio.pause(); // Приостанавливаем звук
        audio.currentTime = 0; // Сбрасываем время воспроизведения на начало
    }
    function stopRunBallSound() {
        audioRunBall.pause(); // Приостанавливаем звук
        audioRunBall.currentTime = 0; // Сбрасываем время воспроизведения на начало
    }


    function show_X_WithSound() {
        // Показать _TxBow_X
        var _TxBow_X = m_scenes.get_object_by_name("TxBow_X");
        m_scenes.show_object(_TxBow_X, false);
        if (_zvuk)
            playFoulSound(); // Запускаем звук
        // Через 600 мс остановить звук и спрятать _TxBow_X
        m_time.set_timeout(function () {
            //stopFoulSound();
            m_scenes.hide_object(_TxBow_X, false);
        }, 600);
    }
    //#####################   конец звук#################
 // включаем движение, передаем в создание сенсора(init_control_3),а там вкл.контроль над движением
    function main_moving(obj) {

        if (move == true) {
            if (_moving_obj) {
                not_select = true;
               //console.log("_moving_obj");
                var mass = 20.0; // масса шара
                var radius = 0.5; //  радиус шара (из настройки объекта)

                // Момент инерции сферы
                var moment_of_inertia = (2 / 5) * mass * Math.pow(radius, 2);

                // Желаемая угловая скорость (рад/с) и время достижения этой скорости
                var desired_angular_velocity = 25.0; // рад/с
                var time_to_reach_velocity = 1.0; // секунды
                var angular_acceleration = desired_angular_velocity / time_to_reach_velocity;

                // Рассчитываем момент силы (торк)
                //var torque = moment_of_inertia * angular_acceleration;          
                // Рассчитываем момент силы (торк) в мировой системе
                var torque_x = moment_of_inertia * angular_acceleration; // вращение вокруг X
                var torque_world = [torque_x, 0.0, 0.0];

                // Получаем ориентацию объекта в виде кватерниона
                var rotation_quat = m_trans.get_rotation(obj);

                // Преобразуем торк в локальную систему координат
                var torque_local = [0, 0, 0];
                var m_vec3 = b4w.vec3;

                m_vec3.transformQuat(torque_world, rotation_quat, torque_local);

                var rnd_transInt2 = ((Math.random() - .5) * 2) * 5;

                var razn = (_last_posX_R - _last_posX_L) / 1000;
                // Применяем линейное движение
                m_phy.apply_velocity_world(obj, 0.0, 12.0, 0.0);
                m_phy.apply_force_world(obj, 0.0, 12.0, 0.0);

                m_phy.apply_torque(obj, -torque_local[0], torque_local[1] + rnd_transInt2, torque_local[2]);

                var my_camera = m_scenes.get_object_by_name("Camera");
                // камера бежит за шаром
                m_const.append_copy_loc(my_camera, obj, 'XYZ', false, 0.45);

                if (_zvuk)
                    playRunBallSound();
                var id = m_scenes.get_object_data_id(obj);
               //console.log("id=" + id);
                init_control_3(obj, id);
            }
        }

        function init_control_3(obj, id) {
           //console.log("function init_control");
            if (move) {
                //create sensor
                var elapsed_sensor = m_ctl.create_elapsed_sensor();//"MAIN"
                m_ctl.create_sensor_manifold(obj, "MAIN", m_ctl.CT_CONTINUOUS, [elapsed_sensor], null, main_cb);
               //console.log("CALL function main_cb");
            }
            else {
                return false;
            }
        }

    }

    //////////// Функция контроля движения шара
    function main_cb(obj, id) {
        try {

            if (move) {
                var m_vec3 = b4w.vec3;
                var _vec3_tmp = m_vec3.create();

                // Проверяем положение объекта
                var translation = m_trans.get_translation(obj, _vec3_tmp);

                if (translation[1] < -13.0) {

                   console.log("Error 1");
                    if (_zvuk) 
                        stopRunBallSound();
                    show_X_WithSound();
                    _Break = true;
                    X_anim(obj);
                    move = false;
                    move_2 = false;
                    _selected_obj = m_scenes.get_object_by_name("Empty");

                }
                if (translation[1] >= -10.0 && translation[1] < -8.0) {
                    move_2 = true;
                }
               //console.log("move_2=" + move_2);
                if (move_2) {
                    // Если шар укатился за конец дорожки
                    if (translation[1] > 27.0 && move_2 == true) {
                       //console.log("Posle Error-if (translation[1]");
                        if (_zvuk) {
                            stopRunBallSound();
                            playKegliSound();
                        }

                        _Break = false;
                        // Запускаем процесс подсчета
                        first_anim(obj, id, translation);
                        move = false;
                        move_2 = false;
                        _selected_obj = m_scenes.get_object_by_name("Empty");
                        var my_camera = m_scenes.get_object_by_name("Camera");
                        m_const.remove(my_camera);
                        m_phy.disable_simulation(my_camera);
                        m_trans.set_translation(my_camera, 0.0, 16.2, 1.0);
                    }
                } else {
                    if (translation[1] > 0.0) {
                        console.log("Error 2 translation[1]"+translation[1]);
                        if (_zvuk) 
                            stopRunBallSound();

                    /*    foule();
                    }
                    function foule() {*/
                        _Break = false;//?????
                        NumBroska_Player -= 1;
                        m_phy.disable_simulation(obj);
                        m_trans.set_translation(obj, 0.0, -11.0, -0.675);
                        m_trans.set_rotation_euler(obj, 0, 0, 0);
                        _selected_obj = m_scenes.get_object_by_name("Empty");
                        _first_Click = true;
                        _enable_click = false;
                        move = false;
                        move_2 = false;
                        var my_camera = m_scenes.get_object_by_name("Camera");
                        m_const.remove(my_camera);
                        m_phy.disable_simulation(my_camera);
                        m_trans.set_translation(my_camera, 0.0, -16.2, 1.0);
                    }
                }
            }
        } catch (e) {
           console.error("Error catch in main_cb:", e);
        }
    }
    // Фол
    function X_anim(obj) {//obj, id, translation) {
        m_phy.apply_velocity_world(obj, 0.0, 0.0, 0.0);
        m_phy.apply_torque(obj, 0.0, 0.0, 0.0);
        m_phy.apply_force_world(obj, 0.0, 0.0, 0.0);
        m_phy.set_angular_velocity(obj, 0.0, 0.0, 0.0);
        camera_onPlace();
        // Установить объект пинспоттера и применить анимацию
        var pin_change = m_scenes.get_object_by_name("Change_Pin");

        // Применить анимацию "Pin_Down"
        m_anim.apply(pin_change, "Pin_Down", m_anim.SLOT_0);

        // Задать начальный кадр
        m_anim.set_frame(pin_change, 1);
        m_anim.play(pin_change);

        own_countPinPad = 0;
        thru_count(own_countPinPad);
       //console.log("X_anim11 FrameTrue=" + FrameTrue + " NumBroska_Player=" + NumBroska_Player);
        if (NumBroska_Player % 2 == 0) {
            // pins_OnPlace();
           //console.log("X_anim22 FrameTrue=" + FrameTrue);
            if (FrameTrue != 11)
                pins_OnPlace();
        if(EndGame)
            for (var i = 0; i < 5; i++) {
                var bal = m_scenes.get_object_by_name(all_bowl[i]);
                m_phy.disable_simulation(bal);
                m_trans.set_translation_v(bal, pos_all_hide_bowl);
                m_scenes.hide_object(bal);
                not_select = false;
            }
        //else if (FrameTrue == 11 && own_countPinPad == 10)
        //    pins_OnPlace();
        }

    }
    // Функция спуска пинспоттера в самом начале или конце, или подъема в начале игры
    function _begin_first_anim(s_tart, e_nd) {
        // Установить объект пинспоттера и применить анимацию
        var pin_change = m_scenes.get_object_by_name("Change_Pin");

        // Применить анимацию "Pin_Down"
        m_anim.apply(pin_change, "Pin_Down", m_anim.SLOT_0);

        // Задать начальный кадр
        m_anim.set_frame(pin_change, s_tart);
        // Воспроизвести анимацию с ограничением диапазона кадров
        function play_animation_with_range(obj_pin, start_frame, end_frame) {
            // Задать начальный кадр
            m_anim.set_frame(obj_pin, start_frame);
            m_anim.play(obj_pin);

            var check_frame = function () {
                var current_frame = m_anim.get_frame(obj_pin);
                if (current_frame > end_frame) {
                    m_anim.stop(obj_pin);
                    pins_OnPlace();

                } else {
                    requestAnimationFrame(check_frame);
                }
            };
            check_frame();
        }

        play_animation_with_range(pin_change, s_tart, e_nd);
    }
    //////////// Функция спуска пинспоттера
    function first_anim(obj, id, translation) {
        // Остановить движение шара
        m_phy.apply_velocity_world(obj, 0.0, 0.0, 0.0);
        m_phy.apply_torque(obj, 0.0, 0.0, 0.0);
        m_phy.apply_force_world(obj, 0.0, 0.0, 0.0);
        m_phy.set_angular_velocity(obj, 0.0, 0.0, 0.0);
        // Подготовить перемещение шара
        /*m_phy.disable_simulation(obj);
        m_trans.set_rotation_euler(obj, 0, 0, 0);
        m_trans.set_translation(obj, translation[0], 35.0, translation[2]);*/
        // Установить объект пинспоттера и применить анимацию
        var pin_change = m_scenes.get_object_by_name("Change_Pin");

        // Применить анимацию "Pin_Down"
        m_anim.apply(pin_change, "Pin_Down", m_anim.SLOT_0);

        // Задать начальный кадр
        m_anim.set_frame(pin_change, 1);
        
        // Воспроизвести анимацию с ограничением диапазона кадров
        function play_animation_with_range(obj_pin, start_frame, end_frame) {
            m_anim.set_frame(obj_pin, start_frame);
            m_anim.play(obj_pin);

            var check_frame = function () {
                var current_frame = m_anim.get_frame(obj_pin);
                if (current_frame > end_frame) {
                    m_anim.stop(obj_pin);
                    //m_anim.set_frame(obj_pin, start_frame); // Возврат к началу диапазона (опционально)
                    // Очистим все предыдущие значения
                    m_pins_onPlos = [];
                    //numDownPins = [];
                    //own_countPinPad = null;
                   //console.log("m_pins_onPlos=" + m_pins_onPlos);
                   //console.log("numDownPins=" + numDownPins);
                    // Вызываем функцию подсчета упавших кеглей
                    var result = countPinPad(obj, id);
                   //console.log("result=" + result);

                } else {
                    requestAnimationFrame(check_frame);
                }
            };
            check_frame();
        }

        play_animation_with_range(pin_change, 1, 30);

    }

    ///////// Функция подсчета всех упавших, с переходом в second_anim
    function countPinPad(obj, id) {
        var count = 0; // Сбито, НЕ оставшихся на столе
        var rng = 0;
        var cnt = 0; // Сбито, оставшихся на столе

        // Очищаем массивы
        // numDownPins = [];
        // m_pins_onPlos = [];

        if (rng == 0) {
            for (var step = 1; step < 11; step++) {
                var pin_name = "Pin" + step;
                //console.log(pin_name);

                var _pin1 = m_scenes.get_object_by_name(pin_name);
                var m_vec3 = b4w.vec3;
                var _vec3_tmp = m_vec3.create();
                var translation = m_trans.get_translation(_pin1, _vec3_tmp);

                //console.log("Координаты кегли:", translation);

                if (
                    translation[2] <= -1.06502 ||
                    translation[2] > 0.8 ||
                    translation[1] >= 25.4 ||
                    translation[0] >= 1.725 ||
                    translation[0] <= -1.725
                ) {
                    count++;
                    numDownPins.push(step);
                   //console.log("Кегля НЕ на столе:", step);
                } else {
                    m_pins_onPlos.push(step);
                   //console.log("Кегля на столе:", step);
                }

                if (step == 10) {
                    rng = 1;
                }
            }
        }

        if (rng == 1) {
           //console.log("Начинаем отслеживать кегли на столе:", m_pins_onPlos);

            monitorPins(m_pins_onPlos, function (result) {
               //console.log("Все кегли остановились. Количество упавших кеглей:", result);
                count += result;
                rng = 2;
               //console.log("Общее количество упавших кеглей:", count);
                second_anim(count, numDownPins, m_pins_onPlos);//second_anim(count); // Продолжение после завершения: 
            });
        }
    }


    /////// НОВАЯ Функция подсчета упавших,но оставшихся на столе
    function monitorPins(onPlos, callback) {
        var threshold = 0.005; // Порог для определения остановки
        var m_vec3 = b4w.vec3;
        var m_trans = b4w.transform;//require("transform");
        var m_quat = b4w.quat;//require("quat");

        var allStopped = Array(onPlos.length).fill(false); // Булев массив для отслеживания состояния
        //var numDownPins = []; // Массив для хранения упавших кеглей
        var count = 0; // Количество упавших кеглей

        function checkPins() {
            var allAreStopped = true;

            for (var i = 0; i < onPlos.length; i++) {
                var pinName = "Pin" + onPlos[i];
                var pin = m_scenes.get_object_by_name(pinName);

                if (!pin) {
                   //console.warn("Объект не найден:", pinName);
                    continue;
                }

                // Проверяем скорость для определения остановки
                /*var currPos = m_trans.get_translation(pin, m_vec3.create());
                var currQuat = m_trans.get_rotation(pin, m_quat.create());
                var velocities = calculate_velocities(pinName, currPos, currQuat);
                var linearSpeed = m_vec3.length(velocities.linear_velocity);
                var angularSpeed = m_vec3.length(velocities.angular_velocity);

                // Если объект остановился
                //if (linearSpeed <= threshold && angularSpeed <= threshold) {
                if (angularSpeed <= threshold) {
                    allStopped[i] = true;
                } else {
                    allStopped[i] = false;
                    allAreStopped = false; // Если хотя бы одна кегля движется, ставим флаг
                }*/

                // Проверяем наклон кегли, если она остановилась
                if (allStopped[i]) {
                    var eulerAngles = m_trans.get_rotation_euler(pin, m_vec3.create());
                    if ((Math.abs(eulerAngles[0]) > 0.2 || Math.abs(eulerAngles[1]) > 0.2)) {
                        if (!numDownPins.includes(onPlos[i])) {
                            numDownPins.push(onPlos[i]);
                            count++;
                        }
                    }
                }
            }

            // Если все объекты остановились, вызываем callback
            if (allAreStopped) {
               //console.log("Все кегли остановились. Упавшие кегли:", count);
                callback(count); // Возвращаем результат через callback
            } else {
                // Продолжаем проверку на следующем кадре
                requestAnimationFrame(checkPins);
            }
        }

        // Запуск проверки
        checkPins();
    }

    function sum(arr) {
        var result = 0, n = arr.length || 0; //may use >>> 0 to ensure length is Uint32
        while (n--) {
            result += +arr[n]; // unary operator to ensure ToNumber conversion
        }
        return result;
    }

    function frame_Not_10(i, frame_score, CountPins, NumberThrow, NumFrame) {
        //# Если в текущем фрейме Страйк                        
        if (CountPins[i][1] == 10 && NumberThrow[i][1] == 1) { //:# len(CountPins[i]) == 2:
            //#print("Yes Strike")
            //#print("CountPins=", CountPins)
            frame_score = 10;  //# За страйк даем сразу 10 очков

            //# Проверяем следующие два броска для бонуса за страйк
            if (i + 1 < 10) {//: # сл.фрейм НО НЕ 10й                
                //# Если следующий фрейм тоже страйк
                if (CountPins[i + 1][1] == 10 && NumberThrow[i + 1][1] == 1) {
                    frame_score += 10; // # За сл.страйк добавляем 10 очков

                    if (i + 2 < 10) { // # сл.фрейм ЧЕРЕЗ фрейм  НО НЕ 10й

                        //# Если следующий ЧЕРЕЗ фрейм тоже страйк
                        if (CountPins[i + 2][1] == 10 && NumberThrow[i + 2][1] == 1) {
                            //#print("[i+2][0]CountPins")
                            //# Добавим значение 2го броска(10)
                            frame_score += CountPins[i + 2][1];
                        } else {
                            //# Если следующий ЧЕРЕЗ фрейм НЕ страйк
                            if (CountPins[i + 2][0] != 0) {
                                //# Добавим значение 1го броска
                                frame_score += CountPins[i + 2][0];
                            }

                        }

                    }
                }
                else {
                    //## Если следующий фрейм НЕ страйк
                    //#print("2 broska=", sum(CountPins[i + 1][: 2]))
                    //# Берем оба броска следующего фрейма
                    frame_score += (CountPins[i + 1][0] + CountPins[i + 1][1]);
                }

            }
        }
        //# Если в текущем фрейме Спэа
        else {
            if (sum(CountPins[i]) == 10 && NumberThrow[i][1] == 2) {//:#len(CountPins[i]) == 2:
                frame_score = 10; //  # За Спэа даем 10 очков

                if (i + 1 < 10) {//: # сл.фрейм НО НЕ 10й
                    if (NumberThrow[i + 1][0] != 0)//# Добавляем первый бросок следующего фрейма

                        frame_score += CountPins[i + 1][0];

                    if (NumberThrow[i + 1][0] == 0)//# Добавляем второй бросок следующего фрейма

                        frame_score += CountPins[i + 1][1];
                }
            }
        }
        return frame_score
    }// End function frame_Not_10

    function calculate_score(CountPins, NumberThrow, NumFrame) {
        var total_score = 0;
        var frame_scores = []; //  # Для хранения очков по каждому фрейму
       //console.log("CountPins=" + CountPins);
        if (NumFrame != 11) {
            //# Проход по каждому фрейму
            for (var i = 0; i < NumFrame; i++) {
                //# Считаем текущий фрейм как сумму сбитых кеглей
                var frame_score = sum(CountPins[i]);
               //console.log("NumFrame=" + NumFrame + " frame_score=" + frame_score);
                //# Пересчитываем текущий фрейм с учетом след.фреймов
                frame_score = frame_Not_10(i, frame_score, CountPins, NumberThrow, NumFrame);
                //# Добавляем текущий фрейм к общему счету
                total_score += frame_score;
                frame_scores.push(frame_score);
               //console.log("frame_scores=" + frame_scores + "  total_score=" + total_score);
            }
        }
        if (NumFrame == 11) {
            //# Проход по каждому фрейму
            for (var i = 0; i < NumFrame; i++) {
                //# Считаем текущий фрейм как сумму сбитых кеглей
                frame_score = sum(CountPins[i]);
                if (i < 9) { //# Если Это не 10й фрейм
                    //# Пересчитываем текущий фрейм с учетом след.фреймов
                    frame_score = frame_Not_10(i, frame_score, CountPins, NumberThrow, NumFrame);
                }
                if (i == 10) {//: # Если Это 10й фрейм
                    frame_score -= sum(CountPins[i]);
                    frame_score += CountPins[i][0];
                }
                //# Добавляем текущий фрейм к общему счету
                total_score += frame_score;
                frame_scores.push(frame_score);
            }
        }

        return { total_score: total_score, frame_scores: frame_scores };
    }// End function calculate_score

    function Summa(NumFrame, Place, count, NumBroska) {
       //console.log("My v function Summa  NumFrame=" + NumFrame);

        if (count != null) {
            var NB = 0;
            if (NumBroska % 2 == 0) {
                NB = 1;
            }
            else {
                NB = 0;
            }
            if (NB == 1) {
                if (NumFrame < 10)//#Если это не 10й фрейм
                    if (count == 10 && Game[NumFrame - 1][NB - 1] != 0)
                        count = count - Game[NumFrame - 1][NB - 1];
                if (NumFrame == 10 && Game[NumFrame - 1][NB - 1] != 0 && Game[NumFrame - 1][NB - 1] != 10)
                    if (count == 10)
                        count = count - Game[NumFrame - 1][NB - 1];
                //Game[NumFrame - 1][NB] = count;
            }
            if (NumFrame == 11)
                if (CountSecond10 != 0)
                    count = count - CountSecond10;
            if (count <= 0)
                count = 0;

            Game[NumFrame - 1][NB] = count;// ?????? bylo Game[NumFrame - 1][NB] = count;
            _Place[NumFrame - 1][NB] = Place;// ????? bylo _Place[NumFrame - 1][NB] = Place;           

           //console.log("NB=" + NB + " count=" + count);
           //console.log("NumFrame-1=" + (NumFrame - 1));// + " Game=" + Game[NumFrame - 1][NB - 1]);
           //console.log(Game.join("\n") + "\n\n");
            if (NumFrame != 11) {  //#Если это не последний фрейм
                if (NB == 1) {  //#Если Второй бросок  CountPins, NumberThrow, od.Player_NumFrame
                    var all = calculate_score(Game, _Place, NumFrame);
                    //console.log("all=" + all);

                   //console.log("Total Score:", all.total_score);
                   //console.log("Frame Scores:", all.frame_scores);

                    for (var i = 0; i < NumFrame; i++)
                        Schet_0[i + 1] = all.frame_scores[i];//all[1][i];

                    Total = all.total_score;//all[0]; //#str(all[0])
                    if (TextVisualClasic) {
                        for (var i = 1; i < NumFrame; i++)
                            Schet_0[i + 1] = Schet_0[i + 1] + Schet_0[i];
                    }


                    //console.log("all=" + all);
                   //console.log("NumFrame != 11 od.Schet_0=" + Schet_0);
                    //bge.logic.sendMessage("result",str(NumFrame))
                }
            }

            if (NumFrame == 11) {//#Если это последний фрейм
               //console.log("NumFrame == 11");
                if (NB == 0) {  //#Если Первый бросок
                   //console.log("NumFrame == 11 Если Первый бросок");
                    all = calculate_score(Game, _Place, NumFrame);
                    for (var i = 0; i < NumFrame; i++) {
                        Schet_0[i + 1] = all.frame_scores[i];
                       //console.log("all.frame_scores[" + i + "]= " + all.frame_scores[i]);
                    }
                    if (Schet_0.length == 12) {
                        Schet_0[10] += Schet_0[11];
                    }
                        
                    Total = all.total_score;
                   //console.log("NumFrame == 11 Total= " + Total);
                    if (TextVisualClasic) {
                        for (var i = 1; i < NumFrame; i++)
                            Schet_0[i + 1] = Schet_0[i + 1] + Schet_0[i];
                    }
                   //console.log(" 11 od.Schet_0=" + Schet_0);
                    //bge.logic.sendMessage("result", str(NumFrame - 1)) 
                }
            }
        }
        else {
           //console.log("XXXXXXXXXXXXXXXXXXXXXXXX    count = None");
        }
    } // End function Summa
    ///////////////////////////////////////////

    // Все считаем и выводим на монитор
    function thru_count(own_countPinPad) {
        function set_txt(num) {

            if (num == "X" || num == "Slash") {
                if (_zvuk)
                    playStrikeSound(num);
                else
                    show_Strike(num);
            }


            var TxPosFirst01 = 1.80706;
            TxName += 1;
            var obname = "Orig" + num;
           //console.log("obname=" + obname);
            var ob = m_scenes.get_object_by_name(obname);
            //var rot = m_trans.get_rotation_euler(ob, new Float32Array(3));
            var ob_copy = m_obj.copy(ob, "Tx" + TxName, true);
            //var ob_copy = m_obj.copy(ob, "Tx" + Player_NumFrame + Player_PlaceInFrame, true);
            m_scenes.append_object(ob_copy);
           //console.log("ob_copy=" + ob_copy);
            var copy_name = m_scenes.get_object_name(ob_copy);
           //console.log("copy_name=" + copy_name);
            //m_phy.disable_simulation(ob_copy); 1.84663
            //m_trans.set_translation(ob_copy, 1.84763 + (NumBroska_Player - 1) * 0.098, -11.10742, 0.72512);
            m_trans.set_translation(ob_copy, TxPosFirst01 + (NumBroska_Player - 1) * 0.10367, -11.10742, 0.72512);
            own_dobavka = 0;
            //m_trans.set_rotation_euler(ob_copy, rot[0], rot[1], rot[2]);
            //m_obj.remove_object(ob_copy);
        }
        function _9() {
            //# Если это Страйк(выбито 10 при первом броске Фрейма)
            if (Player_PlaceInFrame == 1) {

                //bge.logic.sendMessage("strike")
                //print("+++++++++++++++++++++++strike")
                //#print("pred od.NumBroska_Player=", od.NumBroska_Player)
                if (own_dobavka == 0) {
                    NumBroska_Player += 1; //# добавим кол.бросков
                    own_dobavka = 1;
                    set_txt("X");
                    //#print("POSLE od.NumBroska_Player=", od.NumBroska_Player)
                }

            }
            //# Если это Спаэр(выбито 10 при втором броске Фрейма)
            if (Player_PlaceInFrame == 2)
                set_txt("Slash");
            //bge.logic.sendMessage("spare")
        }
        function _10_1() {
            //print("def _10_1(ob)")
            //# Если это Страйк(выбито 10 при первом броске Фрейма)
            if (Player_PlaceInFrame == 1) {
                set_txt("X");
                //bge.logic.sendMessage("strike")
                CountFirst = 10;
                LastShot = true;
                var obL = m_scenes.get_object_by_name("Over_10_Frame");
                m_scenes.hide_object(obL);
            }

        }


        function _10_2(ob) {
            //print("def _10_2(ob)")
            //# Если это Спаэр(выбито 10 при втором броске Фрейма)
            if (Player_PlaceInFrame == 2) {
                if (CountFirst == 10)
                    set_txt("X");
                //bge.logic.sendMessage("strike")
                if (CountFirst != 10) {
                    set_txt("Slash");
                    //bge.logic.sendMessage("spare")
                    LastShot = true;
                    var obL = m_scenes.get_object_by_name("Over_10_Frame");
                    m_scenes.hide_object(obL);
                }

            }

        }

        function _11() {
            //# Если это Страйк(выбито 10)
            if (CountSecond10 == 0)
                set_txt("X");
            else {
                var ra_zn = own_countPinPad - CountSecond10;
                set_txt(ra_zn);
            }
        }



        function _9_10_first() {
            CountFirst = own_countPinPad;
            //# Если это 1й бросок фрейма
            if (own_countPinPad != 0) {
                set_txt(own_countPinPad);
            }
            else {
                if (_Break == false)
                    //console.log("Break == False");
                    set_txt("Tire");
                if (_Break == true)
                    //console.log("Break == true");
                    set_txt("F");
            }
        }
        function _9_10_second_11() {
            //if (ob) {
            if (own_countPinPad > 0) {
                //var obname = m_obj.copy(ob, "Tx" + Player_NumFrame + Player_PlaceInFrame, true);
                //console.log("obname=" + obname);
                //console.log("own_countPinPad=" + own_countPinPad);
                set_txt(own_countPinPad);
                //ob[0].text = str(self.own['countPinPad'])
            }


            else {
                if (_Break == false)
                    //console.log("Break == False");
                    set_txt("Tire");
                if (_Break == true)
                    //console.log("Break == true");
                    set_txt("F");
            }

            // }

        }
        function _9_10_second_12() {
           //console.log("poslali Slash");
            set_txt("Slash");
        }

        function _9_10_second_2() {
            if (own_countPinPad != 0)
                set_txt(own_countPinPad);
            else {
                if (_Break == false)
                    set_txt("Tire");
                if (_Break == true)
                    set_txt("F");
            }
            CountSecond10 = own_countPinPad;
        }

        function _9_10_second_3() {
            if (own_countPinPad != 0)
                set_txt(own_countPinPad);
            else {
                if (_Break == false)
                    set_txt("Tire");
                if (_Break == true)
                    set_txt("F");
            }
            CountSecond10 = 0;
        }

        if (own_countPinPad == 10) {
            if (FrameTrue < 10) //# Frames до 10го
                _9();
            if (FrameTrue == 10) {
                //numPlayer = int(str(od.Player_NumFrame) + str(od.Player_PlaceInFrame))
                //ob = [i for i in self.scena.objects if i.name == 'TxBowSchet' and i['NumTx'] == numPlayer]
                //if ob[0]:
                if (Player_PlaceInFrame == 1)
                    _10_1();
                if (Player_PlaceInFrame == 2)
                    _10_2();
            }

            if (FrameTrue == 11)
                //    numPlayer = int(str(od.Player_NumFrame) + str(od.Player_PlaceInFrame))
                //ob = [i for i in self.scena.objects if i.name == 'TxBowSchet' and i['NumTx'] == numPlayer]
                //if ob[0]:
                _11();
        }


        //# Если выбито меньше 10 кеглей
        if (own_countPinPad != 10) {

            if (FrameTrue != 11) {

                //# Если это 1й бросок фрейма
                if (Player_PlaceInFrame == 1)
                    _9_10_first();

                // # Если это 2й бросок фрейма
                if (Player_PlaceInFrame == 2) {
                    //numPlayer = int(str(od.Player_NumFrame) + str(od.Player_PlaceInFrame))
                    //ob = [i for i in self.scena.objects if i.name == 'TxBowSchet' and i['NumTx'] == numPlayer]
                    if (FrameTrue < 10) {
                       //console.log("own_countPinPad=" + own_countPinPad);
                       //console.log("CountFirst=" + CountFirst);
                        own_countPinPad -= CountFirst;

                        if ((own_countPinPad + CountFirst) < 10) 
                            _9_10_second_11();
                        if ((own_countPinPad + CountFirst) == 10)
                            _9_10_second_12();

                    }


                    if (FrameTrue == 10) {
                        if (CountFirst == 10)
                            _9_10_second_2();


                        if (CountFirst != 10) {
                            if (own_countPinPad!=0)
                                own_countPinPad -= CountFirst;
                            //# Если в сумме за 2 броска выбито меньше 10
                            _9_10_second_3();
                        }

                    }

                }
            }//////

            if (FrameTrue == 11) {
                if (own_countPinPad != 0) {
                    if (CountSecond10 == 0) {
                        set_txt(own_countPinPad);
                    }
                    else {
                       //console.log("if (FrameTrue == 11) own_countPinPad=" + own_countPinPad);
                       //console.log("if (FrameTrue == 11) CountSecond10=" + CountSecond10);
                        var T11 = own_countPinPad - CountSecond10;
                        set_txt(T11);
                    }
                }
                else {
                    if (_Break == false)
                        set_txt("Tire");
                    if (_Break == true)
                        set_txt("F");
                }
            }
        }
        function _total_count(tt) {

            for (var j = 0; j < tTol + 1; j++) {
                var _newT = "TxTotal" + j;

                if (m_scenes.check_object_by_name(_newT, 0)) {
                    var lastob = m_scenes.get_object_by_name(_newT);
                    m_scenes.remove_object(lastob);
                    //m_scenes.hide_object(lastob);
                }
            }

            function _tx_total_count(kol, _L, _C, _R ) {
                var posFr = 2.63;
                function _input_frame_L_txt(kol, _L, _C, _R) {
                    var obname = "OrNew" + _L;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxTotal" + tTol, true);
                    m_scenes.append_object(ob_copy);
                    m_trans.set_translation(ob_copy, posFr, -11.29191, 0.153);
                    tTol += 1;
                }
                function _input_frame_C_txt(kol, _L, _C, _R) {
                    var obname = "OrNew" + _C;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxTotal" + tTol, true);
                    m_scenes.append_object(ob_copy);
                    m_trans.set_translation(ob_copy, posFr + 0.05228, -11.29191, 0.153);
                    tTol += 1;
                }
                function _input_frame_R_txt(kol, _L, _C, _R) {
                    var obname = "OrNew" + _R;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxTotal" + tTol, true);
                    m_scenes.append_object(ob_copy);
                    m_trans.set_translation(ob_copy, posFr + 0.10367, -11.29191, 0.153);
                    tTol += 1;
                }
                if (kol == 1 && _C == -1 && _R == -1) {

                    _input_frame_L_txt(kol, _L, _C, _R);

                } else if (kol == 2 && _R == -1) {

                    _input_frame_L_txt(kol, _L, _C, _R);

                    _input_frame_C_txt(kol, _L, _C, _R);

                } else {
                    _input_frame_L_txt(kol, _L, _C, _R);
                    _input_frame_C_txt(kol, _L, _C, _R);
                    _input_frame_R_txt(kol, _L, _C, _R);
                }
            }
            var cislo = tt;
           //console.log("cislo = " + cislo);
            if (cislo < 10) {
                // Число из одного разряда
                var _first = cislo;
               //console.log("_first = " + _first);
                _tx_total_count(1, _first, -1, -1);

            } else if (cislo < 100) {
                // Число из двух разрядов
                var _second = cislo % 10; // единицы
                var _first = Math.floor(cislo / 10); // десятки
               //console.log("_first = " + _first + ", _second = " + _second);
                _tx_total_count(2, _first, _second, -1);
            } else {
                // Число из трех разрядов
                var _third = cislo % 10; // единицы
                var _second = Math.floor((cislo % 100) / 10); // десятки
                var _first = Math.floor(cislo / 100); // сотни
               //console.log("_first = " + _first + ", _second = " + _second + ", _thrd = " + _third);
                _tx_total_count(3, _first, _second, _third);
            }
        }
        function _every_frame_count() {
            //const posTot = 1.84584;
            if (TxFrame != 0) {
                for (var j = 1; j < TxFrame + 1; j++) {
                    var _new = "TxT" + j;

                    if (m_scenes.check_object_by_name(_new, 0)) {
                        var lastob = m_scenes.get_object_by_name(_new);
                        m_scenes.remove_object(lastob);
                        //m_scenes.hide_object(lastob);
                    }
                }
            }
            function _tx_frame_count(kol, _L, _C, _R, num) {
                var posFr = 1.84811;
                function _input_frame_C_txt(kol, _L, _C, _R, num, TxFr) {
                    var obname = "OrNew" + _C;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxT" + TxFr, true);
                    m_scenes.append_object(ob_copy);
                    //console.log("ob_copy=" + ob_copy);
                    //var copy_name = m_scenes.get_object_name(ob_copy);
                    //console.log("copy_name=" + copy_name);
                    m_trans.set_translation(ob_copy, posFr + num * (0.10367 * 2), -11.1504, 0.575279);
                }
                function _input_frame_L_txt(kol, _L, _C, _R, num, TxFr, mnoz) {
                    var obname = "OrNew" + _L;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxT" + TxFr, true);
                    m_scenes.append_object(ob_copy);
                    //console.log("ob_copy=" + ob_copy);
                    //var copy_name = m_scenes.get_object_name(ob_copy);
                    //console.log("copy_name=" + copy_name);
                    m_trans.set_translation(ob_copy, posFr + num * (0.10367 * 2) - (0.02614 * mnoz), -11.1504, 0.575279);
                }
                function _input_frame_R_txt(kol, _L, _C, _R, num, TxFr, mnoz) {
                    var obname = "OrNew" + _R;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxT" + TxFr, true);
                    m_scenes.append_object(ob_copy);
                    //console.log("ob_copy=" + ob_copy);
                    //var copy_name = m_scenes.get_object_name(ob_copy);
                    //console.log("copy_name=" + copy_name);
                    m_trans.set_translation(ob_copy, posFr + num * (0.10367 * 2) + (0.02614 * mnoz), -11.1504, 0.575279);
                }
                if (kol == 1 && _L == -1 && _R == -1) {

                    TxFrame += 1;
                    _input_frame_C_txt(kol, _L, _C, _R, num, TxFrame);

                } else if (kol == 2 && _C == -1) {
                    TxFrame += 1;
                    _input_frame_L_txt(kol, _L, _C, _R, num, TxFrame, 1);

                    TxFrame += 1;
                    _input_frame_R_txt(kol, _L, _C, _R, num, TxFrame, 1);

                } else {
                    TxFrame += 1;
                    _input_frame_C_txt(kol, _L, _C, _R, num, TxFrame);
                    TxFrame += 1;
                    _input_frame_L_txt(kol, _L, _C, _R, num, TxFrame, 2);
                    TxFrame += 1;
                    _input_frame_R_txt(kol, _L, _C, _R, num, TxFrame, 2);
                }
            }
            var sf = 1;
            if (FrameTrue == 11)
                sf = 0;
            for (var i = 1; i < FrameTrue+sf; i++) {
                var cislo = Schet_0[i];

                if (cislo < 10) {
                    // Число из одного разряда
                    var _centr = cislo;
                   //console.log("_centr = " + _centr);
                    _tx_frame_count(1, -1, _centr, -1, i - 1);

                } else if (cislo < 100) {
                    // Число из двух разрядов
                    var _right = cislo % 10; // единицы
                    var _left = Math.floor(cislo / 10); // десятки
                   //console.log("_left = " + _left + ", _right = " + _right);
                    _tx_frame_count(2, _left, -1, _right, i - 1);
                } else {
                    // Число из трех разрядов
                    var _right = cislo % 10; // единицы
                    var _centr = Math.floor((cislo % 100) / 10); // десятки
                    var _left = Math.floor(cislo / 100); // сотни
                   //console.log("_left = " + _left + ", _centr = " + _centr + ", _right = " + _right);
                    _tx_frame_count(3, _left, _centr, _right, i - 1);
                }
            }
        }
//##### 11 #####
        if (FrameTrue == 11) {
           //console.log("if (FrameTrue == 11) {");

            Summa(Player_NumFrame, Player_PlaceInFrame, own_countPinPad, NumBroska_Player);
            _every_frame_count();
            _total_count(Total);
            EndGame = true;
            //console.log("EndGame = true  bge.logic.sendMessage(hole, str(self.own['countPinPad']))");
            var elem = document.getElementById("load-1");
            //console.log("document.getElementById");
            if (EndGame && GameBegin) { // Возвращаем старое изображение
                elem.style.backgroundImage = "url('./assets/Balls/New Game.png')";
                GameBegin = false;
                _beginFinal();

            }
            _Break = false;
        }


        if (FrameTrue == 10) {
            //if (LastShot == false && NumBroska_Player % 2 == 0)
            //    EndGame = true;

            Summa(Player_NumFrame, Player_PlaceInFrame, own_countPinPad, NumBroska_Player);
            
            if (LastShot == true) {
                if (own_countPinPad == 10) {
                   //console.log("LastShot = true own_countPinPad = 10");
                    //pin_pos()
                    //Если это 1й бросок фрейма
                    if (NumBroska_Player % 2 != 0) {
                        _total_count(Total + own_countPinPad);
                       //console.log("bge.logic.sendMessage(hole, str(self.own['countPinPad']))");
                    }
                    //Если это 2й бросок фрейма
                    if (NumBroska_Player % 2 == 0) {
                        _every_frame_count();
                        _total_count(Total);
                        FrameTrue += 1;
                    }

                }
                if (own_countPinPad != 10) {
                    //Если это 2й бросок фрейма
                    if (NumBroska_Player % 2 == 0) {
                        _every_frame_count();
                        _total_count(Total);
                        FrameTrue += 1;
                    }
                }
            }
            if (LastShot == false) {
                //Если это 1й бросок фрейма
                if (NumBroska_Player % 2 != 0) {
                   //console.log("bge.logic.sendMessage(hole, str(self.own['countPinPad']))");
                    _total_count(Total+own_countPinPad);
                }
                //Если это 2й бросок фрейма
                if (NumBroska_Player % 2 == 0) {
                    _every_frame_count();
                    _total_count(Total);
                    EndGame = true;

                    //console.log("EndGame = true  bge.logic.sendMessage(hole, str(self.own['countPinPad']))");
                    var elem = document.getElementById("load-1");
                    //console.log("document.getElementById");
                    if (EndGame && GameBegin) { // Возвращаем старое изображение
                        elem.style.backgroundImage = "url('./assets/Balls/New Game.png')";
                        GameBegin = false;
                        _beginFinal();

                    }

                }
            }
            _Break = false;

        }

        if (FrameTrue < 10) {

            Summa(Player_NumFrame, Player_PlaceInFrame, own_countPinPad, NumBroska_Player);
           //console.log("FrameTrue < 10 Total =" + Total + " NumBroska_Player =" + NumBroska_Player);
            if (NumBroska_Player < 3) {
                var obT = m_scenes.get_object_by_name("Total");
                m_scenes.show_object(obT);
            }
            //# Если это 1й бросок фрейма
            if (NumBroska_Player % 2 != 0) { //Schet_0
               //console.log("Schet_0.length=" + Schet_0.length);
               //console.log("Schet_0[FrameTrue]=" + Schet_0[FrameTrue - 1]);
                _total_count(Total + own_countPinPad);


                
            }
            //# Если это 2й бросок фрейма
            if (NumBroska_Player % 2 == 0) {
                _every_frame_count();
                _total_count(Total);
                FrameTrue += 1;
                CountFirst = 0;
                // Зеленая точка
                var TocPosFirst01 = 1.84584;
                var obt = m_scenes.get_object_by_name("OverFrame");//(FrameTrue - 1)

                if (FrameTrue < 10)
                    m_trans.set_translation(obt, TocPosFirst01 + (FrameTrue - 1) * 0.20735, -11.11572, 0.877849);
                if (FrameTrue == 10)
                    m_trans.set_translation(obt, 3.8, -11.11572, 0.877849);
            }
           //console.log("FrameTrue=" + FrameTrue);
           //console.log("Player_NumFrame=" + Player_NumFrame);

        }

    }

///////////////// Функция подъема пинспоттера
    //function second_anim(obj, id, res_count) {
    function second_anim(res_count, numDownPins, onPlos) {
       //console.log("res_count= " + res_count);

        // Установить объект и применить анимацию
        var pin_change = m_scenes.get_object_by_name("Change_Pin");

        // Применить анимацию "Pin_Down"
        m_anim.apply(pin_change, "Pin_Down", m_anim.SLOT_0);

        // Задать начальный кадр
        m_anim.set_frame(pin_change, 30);
        m_anim.play(pin_change);
        //res_count=second_check(count,numDownPins,m_pins_onPlos);
        for (var i = 0; i < onPlos.length; i++) {
            if (onPlos.includes(onPlos[i])) { // Если кегля среди оставшихся на столе
                var pin_name = 'Pin' + onPlos[i];//i;
                var _pin = m_scenes.get_object_by_name(pin_name);
                var eu = m_trans.get_rotation_euler(_pin, _vec3_tmp);
                if ((eu[0] > 0.8 || eu[0] < -0.8) || (eu[1] > 0.8 || eu[1] < -0.8)) {
                    if (!numDownPins.includes(onPlos[i])) {
                       //console.log("if (!numDownPins");
                        numDownPins.push(onPlos[i]);
                        res_count++;                       
                    }
                }
            }
        }
        own_countPinPad = res_count;
        //# Если подсчет упавших произведен
        if (own_countPinPad != null)
            thru_count(own_countPinPad);


        if (own_countPinPad != null && own_countPinPad != 10) {
           //console.log("res_count= " + own_countPinPad);
            if(Player_PlaceInFrame==1)
                comeback_1(own_countPinPad);
            if (Player_PlaceInFrame == 2)
                //if(FrameTrue!=10)
                comeback_2();//(10);
                //else
                   // camera_onPlace();
            }

        if (own_countPinPad != null && own_countPinPad == 10) {
           //console.log("res_count= " + own_countPinPad);
            comeback_2();//(own_countPinPad);
            }

    }
///////////////////////////////////
    // Функция для расчета линейной и угловой скоростей
function calculate_velocities(pin_name, curr_pos, curr_quat) {
    var m_vec3 = b4w.vec3;
    var m_quat = b4w.quat;
    // Функция для извлечения оси и угла из кватерниона
    function getAxisAngle(quat) {
        var angle = 2 * Math.acos(quat[3]); // Кватернион обычно представлен как [x, y, z, w]
        var s = Math.sqrt(1 - quat[3] * quat[3]); // s = sin(angle/2)
        var axis = s < 0.001
            ? [1, 0, 0] // Если s близок к 0, ось по умолчанию [1, 0, 0]
            : [quat[0] / s, quat[1] / s, quat[2] / s]; // Нормализация оси
        return [axis, angle];
    }
    // Получаем предыдущие позиции и ориентации
    var prev_pos = prev_positions[pin_name];
    var prev_quat = prev_rotations[pin_name];

    // Рассчитываем линейную скорость (разница позиций)
    var linear_velocity = m_vec3.create();
    m_vec3.subtract(curr_pos, prev_pos, linear_velocity);

    // Рассчитываем угловую скорость (разница кватернионов)
    var delta_quat = m_quat.create();
    m_quat.invert(prev_quat, delta_quat);
    m_quat.multiply(delta_quat, curr_quat, delta_quat);

    // Преобразуем угловую скорость в "угловую скорость в радианах в секунду"
    //var axis = m_vec3.create();
    //var angle = m_quat.get_axis_angle(delta_quat, axis);
    //var { axis, angle } = getAxisAngle(delta_quat);
    var result = getAxisAngle(delta_quat);
    var axis = result[0];
    var angle = result[1];
    var angular_velocity = m_vec3.scale(axis, angle, m_vec3.create());

    // Сохраняем текущие данные для следующего кадра
    prev_positions[pin_name] = curr_pos.slice();
    prev_rotations[pin_name] = curr_quat.slice();

    return {
        linear_velocity: linear_velocity,
        angular_velocity: angular_velocity,
    };
 }


/////////////  Это шар на место
    function bowl_onPlace() {

        var obj = _moving_obj;//m_scenes.get_object_by_name("Bowl00");
        var m_vec3 = b4w.vec3;
        var _vec3_tmp = m_vec3.create();
        var translation = m_trans.get_translation(obj, _vec3_tmp);
        m_phy.disable_simulation(obj);

        _moving_obj = null;

        if (!EndGame) {
            var _name = m_scenes.get_object_name(obj);

            selectBall(_name, "Bowling BallAction");
            not_select = false;
        }
        else {
            //EndGame = true;
            for (var i = 0; i < 5; i++) {
                var bal = m_scenes.get_object_by_name(all_bowl[i]);
                m_phy.disable_simulation(bal);
                m_trans.set_translation_v(bal, pos_all_hide_bowl);
                m_scenes.hide_object(bal);
                not_select = false;
            }
        }


    }
////////////  Это уже камеру на место
    function camera_onPlace() {
        
        var my_camera = m_scenes.get_object_by_name("Camera");
        m_const.remove(my_camera);
        m_phy.disable_simulation(my_camera);
        m_trans.set_translation(my_camera, 0.0, -16.2, 1.0);//-17.0245, 1.0);
        //m_trans.set_rotation_euler(obj, 73.2833, 0, -0.424292);
        m_phy.enable_simulation(my_camera);
        m_phy.apply_velocity_world(my_camera, 0.0, 0.0, 0.0);
        m_phy.apply_torque(my_camera, 0.0, 0.0, 0.0);
        bowl_onPlace();
    }

///////////////////// Упавших кеглей меньше 10   
    function comeback_1(res_count) {
       //console.log("function comeback_1");
        for (var i = 1; i <= 10; i++) {
            if (numDownPins.includes(i)) { // Если кегля среди упавших
                var pin_name = 'Pin' + i;
                var _pin = m_scenes.get_object_by_name(pin_name);
                // Скроем упавшие
                m_scenes.hide_object(_pin);
                //playKegliSound();
            }
        }
        camera_onPlace();       
    }

    ////////////////////// Все 10 кеглей упали
    function comeback_2() {//(res_count) {
       //console.log("function comeback_2");
        camera_onPlace();
       //console.log("FrameTrue= " + FrameTrue + "  countPinPad= " + own_countPinPad);
        //pins_OnPlace();
        if (FrameTrue != 11)
            pins_OnPlace();
        else if (FrameTrue == 11 && own_countPinPad == 10)
            pins_OnPlace();
    }
//////////////  Возврат кеглей на место 
    function pins_OnPlace() {
        for (var i = 1; i <= 10; i++) {
            //if (numDownPins.includes(i)) { // Если кегля среди упавших
                var pin_name = 'Pin' + i;
                var _pin = m_scenes.get_object_by_name(pin_name);
                m_scenes.show_object(_pin);
                m_phy.disable_simulation(_pin);
                m_trans.set_rotation_euler(_pin, 0, 0, 0);
                
                if (i == 1) {
                    m_trans.set_translation_v(_pin, m_Pins_arr1[0], m_Pins_arr1[1], m_Pins_arr1[2]);
                    off_moving(_pin);
                }
                if (i == 2) {
                    m_trans.set_translation_v(_pin, m_Pins_arr2[0], m_Pins_arr2[1], m_Pins_arr2[2]);
                    off_moving(_pin);
                }
                if (i == 3) {
                    m_trans.set_translation_v(_pin, m_Pins_arr3[0], m_Pins_arr3[1], m_Pins_arr3[2]);
                    off_moving(_pin);
                }
                if (i == 4) {
                    m_trans.set_translation_v(_pin, m_Pins_arr4[0], m_Pins_arr4[1], m_Pins_arr4[2]);
                    off_moving(_pin);
                }
                if (i == 5) {
                    m_trans.set_translation_v(_pin, m_Pins_arr5[0], m_Pins_arr5[1], m_Pins_arr5[2]);
                    off_moving(_pin);
                }
                if (i == 6) {
                    m_trans.set_translation_v(_pin, m_Pins_arr6[0], m_Pins_arr6[1], m_Pins_arr6[2]);
                    off_moving(_pin);
                }
                if (i == 7) {
                    m_trans.set_translation_v(_pin, m_Pins_arr7[0], m_Pins_arr7[1], m_Pins_arr7[2]);
                    off_moving(_pin);
                }
                if (i == 8) {
                    m_trans.set_translation_v(_pin, m_Pins_arr8[0], m_Pins_arr8[1], m_Pins_arr8[2]);
                    off_moving(_pin);
                }
                if (i == 9) {
                    m_trans.set_translation_v(_pin, m_Pins_arr9[0], m_Pins_arr9[1], m_Pins_arr9[2]);
                    off_moving(_pin);
                }
                if (i == 10) {
                    m_trans.set_translation_v(_pin, m_Pins_arr10[0], m_Pins_arr10[1], m_Pins_arr10[2]);
                    off_moving(_pin);
                }
            //}
        }
    }

//////////////  Возврат физики
    function off_moving(obj) {
        m_phy.enable_simulation(obj);
        m_phy.apply_velocity_world(obj, 0.0, 0.0, 0.0);
        m_phy.apply_torque(obj, 0.0, 0.0, 0.0);
        m_phy.apply_force_world(obj, 0.0, 0.0, 0.0);
        m_phy.set_angular_velocity(obj, 0.0, 0.0, 0.0);
    }

    // переключение звука
    function perekl_zvuk(n) {
        var obZ1 = m_scenes.get_object_by_name("icon_sound");
        var obZ2 = m_scenes.get_object_by_name("icon_sound_inv");
        if (n == 1) {
            m_scenes.hide_object(obZ1);
            m_scenes.show_object(obZ2);
            _zvuk = false;
            if (zvk % 2 != 0) {
                //if (zvk == 1)
                stopMusic01();
            }
            else {
                //if (zvk == 2)
                    stopMusic02();
            }

            n = 0;
        }
        if (n == 2) {
            m_scenes.hide_object(obZ2);
            m_scenes.show_object(obZ1);
            _zvuk = true;
            if (zvk % 2 != 0) {
                //if (zvk == 1)
                playMusic01();
            }
            else {
                //if (zvk == 2)
                    playMusic02();
            }

            n = 0;
        }
    }
// Нажали мышь    
    function main_canvas_down(e) {
    // если анимация шара закончилась
        if (!_enable_click) {
        // если нет движения шара
        if (!move) {
            //console.log("function main_canvas_down");
            if (e.preventDefault)
                e.preventDefault();
            // Получаем контейнер canvas
            var canvasContainer = document.getElementById("main_canvas_container");
            var rect = canvasContainer.getBoundingClientRect(); // Положение контейнера
            var x = m_mouse.get_coords_x(e) - rect.left;
            var y = m_mouse.get_coords_y(e) - rect.top;
            //console.log("x=" + x + "  y=" + y);
            var obj = m_scenes.pick_object(x, y);
            var obNew = m_scenes.get_object_name(obj);
            _obj_delta_xy = new Float32Array(2);
            //console.log("obNew=" + obNew);

            if (_selected_obj != obj) {
                _selected_obj = obj;
   // если шар уже стоит на позиции,и шар"взят",убираем видимость курсора и вкл._drag_mode
                if (_first_Click == true) {
                    _drag_mode = true;
                    document.documentElement.style.cursor = 'none';
                }
                //console.log("_first_Click=" + _first_Click);
            }

            // calculate delta in viewport coordinates
            if (_selected_obj) {
                var targ = m_scenes.get_object_name(_selected_obj);
                //console.log("targ=" + targ);
                // если нажали на эмблему звука не перечеркнутую
                if (targ == "icon_sound") {
                    //console.log("icon_sound");
                    // если звук вкл.(_zvuk=true)
                    if (_zvuk)
                        perekl_zvuk(1);//поменяем картинку на перечеркнутую
                }
                // если нажали на эмблему звука перечеркнутую
                if (targ == "icon_sound_inv") {
                    //console.log("icon_sound_inv");
                    // если звук выкл.(_zvuk=false)
                    if (!_zvuk)
                        perekl_zvuk(2);//поменяем картинку на НЕперечеркнутую
                }
                // если нажали на какой-либо шар
                if (targ != "icon_sound" && targ != "icon_sound_inv") {
                    var cam = m_scenes.get_active_camera();

                    var obj_parent = m_obj.get_parent(_selected_obj);
                    if (obj_parent && m_obj.is_armature(obj_parent))
                        // get translation from the parent (armature) of the animated object
                        m_trans.get_translation(obj_parent, _vec3_tmp);
                    else {
                        // выключ.физики шара
                        m_phy.disable_simulation(_selected_obj);
                        m_trans.get_translation(_selected_obj, _vec3_tmp);
                        m_trans.set_rotation_euler(_selected_obj, 0, 0, 0);
                        //document.getElementById("demo").style.cursor = "pointer";
                        //document.getElementById("demo").style.cursor = "none";
                        //if (_first_Click == true)
                        //    document.documentElement.style.cursor = 'none';

                        //если нажали на шар в подающем устройстве,ставим его на позицию
                        if (_first_Click == false) {
                            m_trans.set_translation(_selected_obj, 0.0, -11.0, -0.675);
                            _first_Click = true;// и вкл._first_Click = true
                        }

                    }
                    m_cam.project_point(cam, _vec3_tmp, _obj_delta_xy);

                    _obj_delta_xy[0] = x - _obj_delta_xy[0];
                    _obj_delta_xy[1] = y - _obj_delta_xy[1];
                    //console.log("_obj_delta_xy[0]=" + _obj_delta_xy[0]);
                    //console.log("_obj_delta_xy[1]=" + _obj_delta_xy[1]);
                }
            }
        }
    }
}

// Отпустили мышь 
    function main_canvas_up(e) {
        //console.log("function main_canvas_up");

        if (_selected_obj) {
            // выключаем _drag_mode
            _drag_mode = false;
            // никакой объект не выбран 
            _selected_obj = null;
            // enable camera controls after releasing the object
            if (!_enable_camera_controls) {
                m_app.enable_camera_controls();
                _enable_camera_controls = true;
            }
            //document.documentElement.style.cursor = 'pointer'; это ручка
            document.documentElement.style.cursor = 'default';

        }

    }


// движение мыши при нажатии на объект     
function main_canvas_move(e) {
    //console.log("function main_canvas_move");    
    if (_drag_mode)
        // еще нет броска
        if (move == false) {
            // объект выбран
            if (_selected_obj) {

                // disable camera controls while moving the object
                if (_enable_camera_controls) {
                    m_app.disable_camera_controls();
                    _enable_camera_controls = false;
                }

                // calculate viewport coordinates
                var cam = m_scenes.get_active_camera();

                // Получаем контейнер canvas
                var canvasContainer = document.getElementById("main_canvas_container");
                var rect = canvasContainer.getBoundingClientRect(); // Положение контейнера
                var x = m_mouse.get_coords_x(e) - rect.left;
                var y = m_mouse.get_coords_y(e) - rect.top;

                var m_vec3 = b4w.vec3;
                var _vec3_tmp = m_vec3.create();
                //var obNew = m_scenes.get_object_by_name("Bowl00X");
               //console.log("move1 x=" + x +"  move1 y="+y);
                //var ex = m_scenes.check_object_by_name(_selected_obj, 0)
                //console.log("exist="+ex); // Plane_Main
                /*var Plane = m_scenes.get_object_by_name("Plane_Main");
                var transl = m_trans.get_translation(Plane, _vec3_tmp);
                var _pline_tmp = m_math.create_pline_from_points(transl[0], transl[1]);*/

                // получим имя объекта,кот.выбран
                var targ = m_scenes.get_object_name(_selected_obj);

                // если это имя есть в списке всех шаров
                if (all_bowl.includes(targ)) {                    
                
                    var Z = 0.0;
                    var Y2 = 0.0;
                    // если коорд. мыши больше 0
                    if (x >= 0 && y >= 0) {

                        x -= _obj_delta_xy[0];
                        y -= _obj_delta_xy[1];
                        //console.log("move2 x=" + x + " move2 y=" + y);
                        //console.log(" y=" + y);

                        // emit ray from the camera
                        var pline = m_cam.calc_ray(cam, x, y, _pline_tmp);
                        var camera_ray = m_math.get_pline_directional_vec(pline, _vec3_tmp);
                        //console.log("pline=" + pline);
                        //console.log("camera_ray=" + camera_ray);

                        // calculate ray/floor_plane intersection point
                        //вычислить точку пересечения луча и плоскости пола
                        var cam_trans = m_trans.get_translation(cam, _vec3_tmp2);
                        m_math.set_pline_initial_point(_pline_tmp, cam_trans);
                        m_math.set_pline_directional_vec(_pline_tmp, camera_ray);
                        var point = m_math.line_plane_intersect(FLOOR_PLANE_NORMAL, 0,
                            _pline_tmp, _vec3_tmp3);

                        // получим положение шара
                        var select_trans = m_trans.get_translation(_selected_obj, _vec3_tmp2);
                        //console.log("point=" + point);
                        //console.log("select_transY=" + select_trans[1]);

  //если броска еще нет(move=false) и коорд.мыши ограничены по x(в обе стороны) и по y в одну
                        if (point[0] > -2.1 && point[0] < 1.9 && point[1]>-14.0 && move == false) {

                            // поз.шара по Y
                            var _posY = select_trans[1];

                            // если меньше -14, то равна -14
                            if (_posY < -14.0)
                                _posY = -14.0;

                            // высота шара над полом
                            Z = -0.6;//-0.675;

                            // не пускаем шар меньше чем -14.0
                            if (y > 470.0) {
                                m_trans.set_translation(_selected_obj, point[0], _posY, Z);
                            }

                            else {
                                m_trans.set_translation(_selected_obj, point[0], point[1], Z);
                            }

                            //var predPos = m_trans.get_translation(_selected_obj, _vec3_tmp2);
                            //console.log("predPos=" + predPos);

                            // это для фиксации(приблизит.)стороны замаха(задняя поз.)
                            if (y > 350)
                                _last_posX_R = x;

                            //console.log("_move: obj_X=" + point[0] + ", obj_Y=" + point[1] + ", Z=" + Z);
                            // НЕ ПОНЯТНО ЭТО НУЖНО ИЛИ НЕТ
                            // do not process the parallel case and intersections behind the camera
                            //не обрабатывайте параллельный корпус и пересечения за камерой
                            if (point && camera_ray[1] < 0) {
                                var obj_parent = m_obj.get_parent(_selected_obj);
                                if (obj_parent && m_obj.is_armature(obj_parent))
                                    // translate the parent (armature) of the animated object
                                    //переведите родительский элемент (арматуру) анимированного объекта
                                    m_trans.set_translation_v(obj_parent, point);
                                else
                                    m_trans.set_translation_v(_selected_obj, point);
                                //console.log("do not process the parallel");
                                limit_object_position(_selected_obj);
                                }
                        }

                        // если шар пересекает -11.0 по y
                        if (move == false && select_trans[1] > -11.0) {// && select_trans[1] < 0.0) {
                        //if (move == false && point[1] > -11.0 && point[1] < 0.0) {
                        //if (move == false && y < 220.0 && y > 0.0) { select_trans[1]>-11.0 && 
                           
                            // огранич.разброс по X
                            var _posX = select_trans[0];
                            if (_posX <= -1.8)//bylo -1.19
                                _posX = -1.8;
                            if (_posX >= 1.8)//bylo 1.5
                                _posX = 1.8;
                            // ставим шар на позицию начала движения
                            m_trans.set_translation(_selected_obj, _posX, -10.0, -0.5);
                            //go_go(_selected_obj);
                            // получим положение шара
                            var sel_trans = m_trans.get_translation(_selected_obj, _vec3_tmp2);
                            if (sel_trans[1] >= -10.0 && sel_trans[1] < -8.0) {
                                // откл.drag_mode
                                _drag_mode = false;
                                // движущийся объект = выбранному
                                // Включаем физику шара
                                m_phy.enable_simulation(_selected_obj);
                                _moving_obj = _selected_obj;

                                //var snova = m_trans.get_translation(_selected_obj, _vec3_tmp2);
                                //console.log("snova=" + snova);

                                // enable camera controls after releasing the object
                                if (!_enable_camera_controls) {
                                    m_app.enable_camera_controls();
                                    _enable_camera_controls = true;
                                }
                                // курсор (обычный) видим
                                document.documentElement.style.cursor = 'default';
                                // это для фиксации(приблизит.)стороны замаха(передняя поз.)
                                _last_posX_L = x;
                                // выбранного объекта нет(теперь это _moving_obj)
                                _selected_obj = null;
                                // во время движения не можем нажимать на шар
                                _first_Click = false;
                                // будущая анимция шара возможна
                                _enable_click = true;
                                // увеличим кол-во бросков на 1
                                num_place_frame();
                                // движение шара true
                                move = true;
                                // для фиксации пересечения линии броска
                                move_2 = false;
                                // НАЧИНАЕМ ДВИЖЕНИЕ
                                main_moving(_moving_obj);
                        }

                    }
                    //console.log("_last_posX_R select_trans[1]=" + select_trans[1]);
                    //function go_go(_selected_obj) {

                    //    }

                    }
                }
            }
        }
    }
    function num_place_frame() {
        own_countPinPad = null;
        NumBroska_Player += 1;
        numDownPins = [];
        //console.log("NumBroska_Player=" + NumBroska_Player);
        //console.log("NumBroska_Player/2=" + Math.floor(NumBroska_Player / 2));
        //console.log("NumBroska_Player - Math.floor(NumBroska_Player / 2)=" + (NumBroska_Player - Math.floor(NumBroska_Player / 2)));
        /*od.ResetPins = False
        self.own['dobavka'] = 0*/
        if (NumBroska_Player % 2 == 0) {
            Player_PlaceInFrame = 2;
            Player_NumFrame = NumBroska_Player / 2;
        }

        else {
            Player_PlaceInFrame = 1;
            Player_NumFrame = NumBroska_Player - Math.floor(NumBroska_Player / 2);
        }
        //console.log("NumBroska_Player=" + NumBroska_Player);
        //console.log("Player_PlaceInFrame=" + Player_PlaceInFrame);
        //console.log("Player_NumFrame=" + Player_NumFrame);
    }



    function limit_object_position(obj) {
        var bb = m_trans.get_object_bounding_box(obj);

        var obj_parent = m_obj.get_parent(obj);
        if (obj_parent && m_obj.is_armature(obj_parent))
            // get translation from the parent (armature) of the animated object
            var obj_pos = m_trans.get_translation(obj_parent, _vec3_tmp);
        else
            var obj_pos = m_trans.get_translation(obj, _vec3_tmp);
       //console.log("limit_object_position: obj_pos=" + obj_pos);
        if (bb.max_x > WALL_X_MAX)
            obj_pos[0] -= bb.max_x - WALL_X_MAX;
        else if (bb.min_x < WALL_X_MIN)
            obj_pos[0] += WALL_X_MIN - bb.min_x;

        if (bb.max_z > WALL_Z_MAX)
            obj_pos[2] -= bb.max_z - WALL_Z_MAX;
        else if (bb.min_z < WALL_Z_MIN)
            obj_pos[2] += WALL_Z_MIN - bb.min_z;

        if (obj_parent && m_obj.is_armature(obj_parent))
            // translate the parent (armature) of the animated object
            m_trans.set_translation_v(obj_parent, obj_pos);
        else
            m_trans.set_translation_v(obj, obj_pos);
    }
//});

// import the app module and start the app by calling the init method
//b4w.require("my_project_main").init();
init();
