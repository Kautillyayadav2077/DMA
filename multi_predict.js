var sketch = function( p ) { 
  "use strict";

  var small_class_list = ['bird',
    'ant',
    'antyoga',
    'alarm_clock',
    'ambulance',
    'angel',
    'backpack',
    'barn',
    'basket',
    'bear',
    'bee',
    'beeflower',
    'bicycle',
    'book',
    'brain',
    'bridge',
    'bulldozer',
    'bus',
    'butterfly',
    'cactus',
    'calendar',
    'castle',
    'cat',
    'catbus',
    'catpig',
    'chair',
    'couch',
    'crab',
    'crabchair',
    'crabrabbitfacepig',
    'cruise_ship',
    'diving_board',
    'dog',
    'dogbunny',
    'dolphin',
    'duck',
    'elephant',
    'elephantpig',
    'eye',
    'face',
    'fan',
    'fire_hydrant',
    'firetruck',
    'flamingo',
    'flower',
    'floweryoga',
    'frog',
    'frogsofa',
    'garden',
    'hand',
    'hedgeberry',
    'hedgehog',
    'helicopter',
    'kangaroo',
    'key',
    'lantern',
    'lighthouse',
    'lion',
    'lionsheep',
    'lobster',
    'map',
    'mermaid',
    'monapassport',
    'monkey',
    'mosquito',
    'octopus',
    'owl',
    'paintbrush',
    'palm_tree',
    'parrot',
    'passport',
    'peas',
    'penguin',
    'pig',
    'pigsheep',
    'pineapple',
    'pool',
    'postcard',
    'power_outlet',
    'rabbit',
    'rabbitturtle',
    'radio',
    'radioface',
    'rain',
    'rhinoceros',
    'rifle',
    'roller_coaster',
    'sandwich',
    'scorpion',
    'sea_turtle',
    'sheep',
    'skull',
    'snail',
    'snowflake',
    'speedboat',
    'spider',
    'squirrel',
    'steak',
    'stove',
    'strawberry',
    'swan',
    'swing_set',
    'the_mona_lisa',
    'tiger',
    'toothbrush',
    'toothpaste',
    'tractor',
    'trombone',
    'truck',
    'whale',
    'windmill',
    'yoga',
    'yogabicycle'];

  var large_class_list = ['bird',
    'ant',
    'ambulance',
    'angel',
    'alarm_clock',
    'antyoga',
    'backpack',
    'barn',
    'basket',
    'bear',
    'bee',
    'beeflower',
    'bicycle',
    'bird',
    'book',
    'brain',
    'bridge',
    'bulldozer',
    'bus',
    'butterfly',
    'cactus',
    'calendar',
    'castle',
    'cat',
    'catbus',
    'catpig',
    'chair',
    'couch',
    'crab',
    'crabchair',
    'crabrabbitfacepig',
    'cruise_ship',
    'diving_board',
    'dog',
    'dogbunny',
    'dolphin',
    'duck',
    'elephant',
    'elephantpig',
    'everything',
    'eye',
    'face',
    'fan',
    'fire_hydrant',
    'firetruck',
    'flamingo',
    'flower',
    'floweryoga',
    'frog',
    'frogsofa',
    'garden',
    'hand',
    'hedgeberry',
    'hedgehog',
    'helicopter',
    'kangaroo',
    'key',
    'lantern',
    'lighthouse',
    'lion',
    'lionsheep',
    'lobster',
    'map',
    'mermaid',
    'monapassport',
    'monkey',
    'mosquito',
    'octopus',
    'owl',
    'paintbrush',
    'palm_tree',
    'parrot',
    'passport',
    'peas',
    'penguin',
    'pig',
    'pigsheep',
    'pineapple',
    'pool',
    'postcard',
    'power_outlet',
    'rabbit',
    'rabbitturtle',
    'radio',
    'radioface',
    'rain',
    'rhinoceros',
    'rifle',
    'roller_coaster',
    'sandwich',
    'scorpion',
    'sea_turtle',
    'sheep',
    'skull',
    'snail',
    'snowflake',
    'speedboat',
    'spider',
    'squirrel',
    'steak',
    'stove',
    'strawberry',
    'swan',
    'swing_set',
    'the_mona_lisa',
    'tiger',
    'toothbrush',
    'toothpaste',
    'tractor',
    'trombone',
    'truck',
    'whale',
    'windmill',
    'yoga',
    'yogabicycle'];

  var use_large_models = true;

  var class_list = small_class_list;

  if (use_large_models) {
    class_list = large_class_list;
  }

  var screen_width, screen_height;
  var origin_x, origin_y;
  var insize, outsize;

  var Nsize = 3; 
  var line_width = 1.0;
  var min_sequence_length = 5;

 
  var dx, dy; 
  var pen = 0;
  var prev_pen = 1;
  var x, y; 
  var start_x, start_y;
  var has_started = false; 
  var just_finished_line = false;
  var epsilon = 2; 
  var screen_width, screen_height; 
  var raw_lines;
  var current_raw_line;
  var current_raw_line_simple;
  var strokes, raw_strokes;
  var stroke, raw_stroke;
  var last_point, idx;
  var line_color, raw_line_color, predict_line_color;

  
  var model, model_data;
  var temperature = 0.25;
  var screen_scale_factor = 3.0;
  var async_draw = true;

  
  var model_state;
  var model_x, model_y;
  var model_dx, model_dy;
  var model_is_active;
  var model_steps;
  var model_prev_pen;

  
  var canvas;
  var reset_button;
  var model_sel; 
  var temperature_slider;
  var text_instruction;
  var text_temperature;
  var random_model_button;
  var predict_button;
  var text_title;
  var title_text = "Sketch Stroke Predictor.";

  var print = function(x) {
    console.log(x);
  };

  var set_title_text = function(new_text) {
    title_text = new_text.split('_').join(' ');
    text_title.html(title_text);
  }

  var Create2DArray = function(rows, cols) {
    var arr = [];

    for (var i=0;i<rows;i++) {
       arr[i] = new Array(cols);
    }

    return arr;
  }

  var draw_example = function(example, start_x, start_y, line_color, line_thickness) {
    var i;
    var x=start_x, y=start_y;
    var x, y;
    var pen_down, pen_up, pen_end;
    var prev_pen = [0, 0, 0];   
    var the_line_thickness = 1.0;

    if (typeof line_thickness === "number") {
      the_line_thickness = line_thickness;
    } 

    for(i=0;i<example.length;i++) {
      
      [dx, dy, pen_down, pen_up, pen_end] = example[i];

      if (prev_pen[2] == 1) { 
        break;
      }

      
      if (prev_pen[0] == 1) {
        p.stroke(line_color);
        p.strokeWeight(the_line_thickness);
        p.line(x, y, (x+dx), (y+dy)); 
      }

      
      x += dx;
      y += dy;

      
      prev_pen = [pen_down, pen_up, pen_end];
    }

  };

  var init = function() {
    var i, j;
    origin_x = Create2DArray(Nsize, Nsize);
    origin_y = Create2DArray(Nsize, Nsize);
    screen_width = Math.max(window.innerWidth, 480);
    screen_height = Math.max(window.innerHeight, 320);

    insize = screen_width/2;
    outsize = screen_width/(2*Nsize);

    ModelImporter.set_init_model(model_raw_data);
    if (use_large_models) {
      ModelImporter.set_model_url("https://storage.googleapis.com/quickdraw-models/sketchRNN/large_models/");      
    }

    model_data = ModelImporter.get_model_data();

    model = new SketchRNN(model_data);
    model.set_pixel_factor(screen_scale_factor);

    canvas = p.createCanvas(screen_width, screen_height);
    canvas.position(0, 0);

    p.frameRate(60);
    p.background(255, 255, 255, 255);

   
    model_state = Create2DArray(Nsize, Nsize);
    model_x = Create2DArray(Nsize, Nsize);
    model_y =  Create2DArray(Nsize, Nsize);
    model_dx = Create2DArray(Nsize, Nsize);
    model_dy = Create2DArray(Nsize, Nsize);

    model_is_active = Create2DArray(Nsize, Nsize);
    model_steps = Create2DArray(Nsize, Nsize);
    model_prev_pen = Create2DArray(Nsize, Nsize);

    
    reset_button = p.createButton('start over');
    reset_button.position(5, insize-25);
    reset_button.mousePressed(reset_button_event); 

    
    model_sel = p.createSelect();
    for (i=0;i<class_list.length;i++) {
      model_sel.option(class_list[i]);
    }
    model_sel.position(95, insize-25);
    model_sel.changed(model_sel_event);

    
    random_model_button = p.createButton('random');
    random_model_button.position(226, insize-25);
    random_model_button.mousePressed(random_model_button_event); 

    
    predict_button = p.createButton('predict');
    predict_button.position(290, insize-25);
    predict_button.mousePressed(predict_button_event); 

    
    text_instruction = p.createP("");
    text_instruction.style("font-family", "monospace");
    text_instruction.position(10, insize-60);
    
 
    text_title = p.createP(title_text);
    text_title.style("font-family", "monospace");
    text_title.style("font-size", "16");
    text_title.style("color", "#3393d1"); 
    text_title.position(10, -10);
  };

  var reset_screen_text = function() {
    var class_name = model.name;
    class_name = class_name.split('_').join(' ')
    text_instruction.html('draw partial '+class_name+'.');
  };

  var redraw_screen = function() {
    var i, j;

    p.background(255, 255, 255, 255);
    p.fill(255, 255, 255, 255);

    reset_screen_text();

    for(i=0;i<Nsize;i++) {
      for(j=0;j<Nsize;j++) {
        origin_x[i][j] = j*outsize+screen_width/2;
        origin_y[i][j] = i*outsize;
      }
    }

    p.stroke(0.25);
    p.strokeWeight(0.25);
    p.rect(1, 1, screen_width-1, screen_width/2-1);

    for(i=0;i<Nsize;i++) {
      p.line(screen_width/2+outsize*i-1, 1, screen_width/2+outsize*i-1, screen_width/2);
    }
    for(j=1;j<Nsize;j++) {
      p.line(screen_width/2-1, outsize*j, screen_width, outsize*j);
    }

    
    if (strokes && strokes.length > 0) {
      draw_example(strokes, start_x, start_y, line_color, 3.0);
    }
    if (raw_strokes && raw_strokes.length > 0) {
      draw_example(raw_strokes, start_x, start_y, raw_line_color, line_width);
    }

   
    var o_x, o_y;

    var scale = Nsize;

    var scaled_strokes = model.scale_drawing_by_factor(raw_strokes, 1.0/scale);

    
    for (i=0;i<Nsize;i++) {
      for (j=0;j<Nsize;j++) {

        o_x = origin_x[i][j];
        o_y = origin_y[i][j];

        draw_example(scaled_strokes, o_x+start_x/scale, o_y+start_y/scale, raw_line_color, line_width);

      }
    }

  };

  var restart_all_models = function() {
    var i, j;

    
    for (i=0;i<Nsize;i++) {
      for (j=0;j<Nsize;j++) {
        model_state[i][j] = model.zero_state();
        model_x[i][j] = 0;
        model_y[i][j] = 0;
        model_dx[i][j] = 0;
        model_dy[i][j] = 0;
        model_is_active[i][j] = false;
        model_steps[i][j] = 0;
        model_prev_pen[i][j] = [0, 1, 0];
      }
    }
  };

  var encode_all_models = function(sequence) {
    
    var i, j;

    if (sequence.length <= min_sequence_length) {
      return;
    }
    var short_sequence = model.copy_drawing(sequence, model.max_seq_length);

    
    var rnn_state = model.zero_state();
    rnn_state = model.update(model.zero_input(), rnn_state);
    for (i=0;i<sequence.length-1;i++) {
      rnn_state = model.update(sequence[i], rnn_state);
    }

    
    var sx = last_point[0];
    var sy = last_point[1];

    var dx, dy, pen_down, pen_up, pen_end;
    var s = sequence[sequence.length-1];

    for (i=0;i<Nsize;i++) {
      for (j=0;j<Nsize;j++) {
        model_state[i][j] = model.copy_state(rnn_state); 

        model_x[i][j] = sx;
        model_y[i][j] = sy;

        dx = s[0];
        dy = s[1];
        pen_down = s[2];
        pen_up = s[3];
        pen_end = s[4];

        model_dx[i][j] = dx;
        model_dy[i][j] = dy;
        model_is_active[i][j] = true;
        model_steps[i][j] = 0;
        model_prev_pen[i][j] = [pen_down, pen_up, pen_end];
      }
    }

  };

  var inside_box = function(x, y) {
    if (x >0 && y > 0 && x < outsize && y < outsize) {
      return true;
    }
    return false;
  };

  var process_models = function() {
    var i, j;

    var pdf; 
    var m_dx, m_dy, m_x, m_y;
    var m_pen_down, m_pen_up, m_pen_end;
    var x0, y0, x1, y1;

    var o_x, o_y;

    var scale = Nsize;

   
    for (i=0;i<Nsize;i++) {
      for (j=0;j<Nsize;j++) {

        if (model_steps[i][j] > model.max_seq_len) {
          model_is_active[i][j] = false;
        }

        if (model_is_active[i][j]) {
          o_x = origin_x[i][j];
          o_y = origin_y[i][j];
          m_x = model_x[i][j];
          m_y = model_y[i][j];
          m_dx = model_dx[i][j];
          m_dy = model_dy[i][j];
          m_pen_down = model_prev_pen[i][j][0];
          m_pen_up = model_prev_pen[i][j][1];
          m_pen_end = model_prev_pen[i][j][2];
          model_state[i][j] = model.update([m_dx, m_dy, m_pen_down, m_pen_up, m_pen_end], model_state[i][j]);
          model_steps[i][j] += 1;
          pdf = model.get_pdf(model_state[i][j]);
          [m_dx, m_dy, m_pen_down, m_pen_up, m_pen_end] = model.sample(pdf, temperature, 0.5+0.5*temperature);
          if (m_pen_end === 1) {
            model_is_active[i][j] = false;
            if (async_draw) {
              continue;
            } else {
              return;  
            }
          }

          if (model_prev_pen[i][j][0] == 1) {
            
            x0 = m_x/scale;
            y0 = m_y/scale;
            x1 = (m_x+m_dx)/scale;
            y1 = (m_y+m_dy)/scale;
            if (inside_box(x0, y0) && inside_box(x1, y1)) {
              p.stroke(predict_line_color);
              p.strokeWeight(line_width);
              p.line(o_x+x0, o_y+y0, o_x+x1, o_y+y1);
            }
          }

          model_dx[i][j] = m_dx;
          model_dy[i][j] = m_dy;
          model_prev_pen[i][j] = [m_pen_down, m_pen_up, m_pen_end];
          model_x[i][j] += m_dx;
          model_y[i][j] += m_dy;

          if (!async_draw) {
            return; 
          }

        }

      }
    }

  };

  var draw_user_strokes = function(x, y, dx, dy) {

    
    p.stroke(raw_line_color);
    p.strokeWeight(line_width); 
    p.line(x, y, x+dx, y+dy); 

    
    var i, j;
    var o_x, o_y, x0, y0, x1, y1;

    var scale = Nsize;

    
    for (i=0;i<Nsize;i++) {
      for (j=0;j<Nsize;j++) {

        o_x = origin_x[i][j];
        o_y = origin_y[i][j];

        x0 = x/scale;
        y0 = y/scale;
        x1 = (x+dx)/scale;
        y1 = (y+dy)/scale;

        p.stroke(raw_line_color);
        p.strokeWeight(line_width);
        p.line(o_x+x0, o_y+y0, o_x+x1, o_y+y1);

      }
    }
  };

  var restart = function() {

    restart_all_models();

    
    var r = p.random(64, 224);
    var g = p.random(64, 224);
    var b = p.random(64, 224);
    line_color = p.color(r, g, b, 64);
    raw_line_color = p.color(r, g, b, 255);; 
    r = p.random(64, 224);
    g = p.random(64, 224);
    b = p.random(64, 224);
    predict_line_color = p.color(r, g, b, 255);

    x = insize/2.0;
    y = insize/2.0;
    has_started = false;

    strokes = [];
    raw_strokes = [];
    raw_lines = [];
    current_raw_line = [];

    redraw_screen();
  }

  p.setup = function() {
    init();
    restart();
  };

  var process_user_input = function() {
   
    if (p.mouseIsPressed && (p.mouseX <= insize) && (p.mouseY <= insize-27)) { 
      if (has_started == false) { 
        has_started = true;
        x = p.mouseX;
        y = p.mouseY;
        start_x = x;
        start_y = y;
        pen = 0;
        current_raw_line.push([x, y]);
      } else {
        if (pen == 1) {
          redraw_screen();
        }
        var dx0 = p.mouseX-x; 
        var dy0 = p.mouseY-y; 
        if (dx0*dx0+dy0*dy0 > epsilon*epsilon) { 
          dx = dx0;
          dy = dy0;
          pen = 0;
          if (prev_pen == 0) {
            draw_user_strokes(x, y, dx, dy);
          }

          
          x += dx;
          y += dy;

          
          current_raw_line.push([x, y]);
          just_finished_line = true;

          
        }
      }
    } else { 
      pen = 1;
      if (just_finished_line) {
        current_raw_line_simple = DataTool.simplify_line(current_raw_line);

        if (current_raw_line_simple.length > 1) {
          if (raw_lines.length === 0) {
            last_point = [start_x, start_y];
          } else {
            idx = raw_lines.length-1;
            last_point = raw_lines[idx][raw_lines[idx].length-1];
          }

          raw_stroke = DataTool.line_to_stroke(current_raw_line, last_point);
          raw_strokes = raw_strokes.concat(raw_stroke);

          stroke = DataTool.line_to_stroke(current_raw_line_simple, last_point);
          raw_lines.push(current_raw_line_simple);
          strokes = strokes.concat(stroke);
          redraw_screen();

          
          idx = raw_lines.length-1;
          last_point = raw_lines[idx][raw_lines[idx].length-1];

          encode_all_models(strokes)
        } else {
          if (raw_lines.length === 0) {
            has_started = false;
          }
        }

        current_raw_line = [];
        just_finished_line = false;
      }
      
    }

    prev_pen = pen;
  };

  p.draw = function() {
    process_user_input();
    if (pen === 1) {
      process_models();
    }
  };

  var random_model_button_event = function() {
    var item = class_list[Math.floor(Math.random()*class_list.length)];
    model_sel.value(item);
    model_sel_event();
  };

  var reset_button_event = function() {
    restart();
  };

  var temperature_slider_event = function() {
    temperature = temperature_slider.value()/100;
    redraw_screen();
    restart_all_models();
    encode_all_models(strokes);
  };

  var predict_button_event = function() {
    redraw_screen();
    restart_all_models();
    encode_all_models(strokes);
  };

  var model_sel_event = function() {
    var c = model_sel.value();
   
    var v = "gen";
    var call_back = function(new_model) {
      model = new_model;
      model.set_pixel_factor(screen_scale_factor);
      redraw_screen();
      restart_all_models();
      encode_all_models(strokes);
      set_title_text('sketch-rnn '+model.info.name+' predictor.');
      var large_model_mode = false;
      async_draw = true;
      if (model.zero_state()[0].size > 512) {
        large_model_mode = true;
        async_draw = false;
      }
    }
    set_title_text('loading model '+c+'...<br/><br/><br/>input disabled.');
    ModelImporter.change_model(model, c, v, call_back);
  };

};
var custom_p5 = new p5(sketch, 'sketch');
