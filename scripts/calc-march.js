window.addEventListener('load', () =>{
  document.getElementById("js-calc").addEventListener('click', () => {
    const startTimeMin = Number(document.getElementById("js-start_time_min").value)
    const startTimeSec = Number(document.getElementById("js-start_time_sec").value)
    const requiredArrivalTimeMin = Number(document.getElementById("js-required_arrival_time_min").value)
    const requiredArrivalTimeSec = Number(document.getElementById("js-required_arrival_time_sec").value)

    const startTime = startTimeMin * 60 + startTimeSec
    const requiredArrivalTime =  requiredArrivalTimeMin * 60 +  requiredArrivalTimeSec
    execResolveAndRender(startTime, requiredArrivalTime)
  })
})

const execResolveAndRender = (startTime, requiredArrivalTime) => {
  const goldRes = solver(startTime, requiredArrivalTime, "only_gold");
  const purpleRes = solver(startTime, requiredArrivalTime, "only_purple");
  const mixRes = solver(startTime, requiredArrivalTime, "mix", goldRes[1]);

  const elm = document.getElementById("js-result");

  const buildHtml = (res, title) => {
    let html = `<div class="card p-2 m-2">`;
    html += `<p class="h3">${title}</p>`;
    res.forEach(detail => {
      html += `<ul class="p-1 m-0">${detail}</ul>`;
    })
    html += "</div>";

    return html;
  }

  let insertHTML = '';
  insertHTML += buildHtml(goldRes[0], `金加速のみ ${goldRes[1]}個`);
  insertHTML += buildHtml(purpleRes[0], `紫加速のみ  ${purpleRes[1]}個`);
  mixRes[0].forEach(res =>{
    insertHTML += buildHtml(res, "混合");
  })

  elm.innerHTML = insertHTML;
}

const sec_to_min = (sec) => {
  const minute = Math.floor((sec/60));
  return `${minute.toString().padStart(2, '0')}:${(sec - (60 * minute)).toString().padStart(2, '0')}`
}

const min_to_sec = (min) => {
  let minutes, sec;
  [minutes, sec] = min.split(':').map(v => Number(v))
  return minutes * 60 + sec
}

const solver = (start_time_sec, required_arrival_time_sec, solver_type, upper_gold) => {
  const shortenedTimeSec = start_time_sec - required_arrival_time_sec;

  let current_shortened_time_sec = 0;
  let rest_shortened_time_sec = shortenedTimeSec;
  let current_time = start_time_sec;
  let info_array = [];
  let count = 0;

  switch (solver_type) {
    case 'only_gold':
      while(current_shortened_time_sec <= shortenedTimeSec)  {
        const delta_gold = Math.ceil((current_time/2.0));
        if(delta_gold < rest_shortened_time_sec) {
          info_array.push(sec_to_min(current_time) + " 即")
          current_time -= delta_gold
          rest_shortened_time_sec -= delta_gold
          current_shortened_time_sec += delta_gold
          count += 1
          current_time -= 1
        } else {
          info_array.push(sec_to_min(rest_shortened_time_sec*2))
          count += 1
          break
        }
      }
      break
    case "only_purple":
      while (current_shortened_time_sec <= shortenedTimeSec) {
        const delta_purple = Math.ceil((current_time/4.0));
        if (delta_purple < rest_shortened_time_sec) {
          info_array.push(sec_to_min(current_time) + " 即")
          current_time -= delta_purple
          rest_shortened_time_sec -= delta_purple
          current_shortened_time_sec += delta_purple
          count += 1
        
        } else {
          info_array.push(sec_to_min(rest_shortened_time_sec*4))
          count += 1
          break
        }
        current_time -= 1
      }
      break
    case "mix":
      let current_upper = upper_gold - 1;
      while (current_upper > 0) {
        current_shortened_time_sec = 0
        rest_shortened_time_sec = shortenedTimeSec
        current_time = start_time_sec
        let info_array_tmp = [];

        for (var i = 1; i <= current_upper; i ++) {
          let delta_gold = Math.ceil((current_time/2.0));
          info_array_tmp.push(sec_to_min(current_time) + '　金 即')
          current_time -= delta_gold
          rest_shortened_time_sec -= delta_gold
          current_shortened_time_sec += delta_gold
          current_time -= 1
        }
        console.log(1)
   
        let endFlag = false;
        while (!endFlag && (current_shortened_time_sec <= shortenedTimeSec)) {
          let delta_purple = Math.ceil((current_time/4.0));
          if (delta_purple < rest_shortened_time_sec) {
            console.log(3)
            info_array_tmp.push(sec_to_min(current_time) + '　紫 即')
            current_time -= delta_purple
            rest_shortened_time_sec -= delta_purple
            current_shortened_time_sec += delta_purple
          } else {
            console.log(4)
            info_array_tmp.push(sec_to_min(rest_shortened_time_sec * 4) + '　紫')
            endFlag = true
          }
          current_time -= 1
        }
   
        current_upper -= 1
        info_array.push(info_array_tmp)
      }
      break
  }

  return [info_array, count]
}
