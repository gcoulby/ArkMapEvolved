document.addEventListener('DOMContentLoaded', function ()
{
   new ArkMap();
});

function ArkMap()
{
   var underWaterCaves = [];
   var caves = [];
   var tribes = [];
   var enemyTribes = [];
   var pois = [];

   (function construct()
   {
      document.querySelector('#overlay').addEventListener('mousemove', move);
      document.querySelector('#overlay').addEventListener('mouseout', hide);
      document.querySelector('#overlay').addEventListener('click', click);
      document.querySelector('#addTo').addEventListener('click', addToDatabase);
      document.querySelector('#filter').addEventListener('change', refreshTable);
      document.getElementById('newMap').addEventListener('click', confirmSave);
      document.getElementById('loadTemplate').addEventListener('click', confirmSave);
      document.getElementById('files').addEventListener('change', loadMap, false);
      document.getElementById("loadMap").addEventListener("click", function ()
      {
         document.getElementById("files").click();  // trigger the click of actual file upload button
      });
      document.querySelector('#saveMap').addEventListener('click', saveMap);
      document.querySelector('#saveConfirmYes').addEventListener('click', processConfirm);
      document.querySelector('#saveConfirmNo').addEventListener('click', processConfirm);
      //document.querySelector('#saveConfirmYes').addEventListener('click', saveAndClear);
      //document.querySelector('#saveConfirmNo').addEventListener('click', newMap);

      for (var i = 10; i < 100; i += 10)
      {
         document.getElementById("overlayInner").innerHTML += '<div style="top:' + ((7 * i) - 12) + 'px;" class="number lat lat' + i + '">' + i + '</div>';
         document.getElementById("overlayInner").innerHTML += '<span style="left:' + ((7 * i) - 12) + 'px;" class="number lon lon' + i + '">' + i + '</span>';
      }

      drawGrid();
      refreshTable();

      if (window.File && window.FileReader && window.FileList && window.Blob)
      {
         console.log("Great success! All the File APIs are supported.");
      }
      else
      {
         console.log('The File APIs are not fully supported in this browser.');
      }
   })();

   function drawGrid()
   {
      var map_canvas = document.getElementById("map");
      var context = map_canvas.getContext("2d");

      for (var x = 70; x < 700; x += 70)
      {
         context.moveTo(x, 45);
         context.lineTo(x, 655);
      }

      var count = 1;
      for (var y = 70; y < 700; y += 70)
      {
         if (count != 10)
         {
            context.moveTo(50, y);
            context.lineTo(650, y);
         }
      }
      context.strokeStyle = "#000";
      context.stroke();
   }

   function refreshTable()
   {
      var filter = document.getElementById("filter").value.toString();
      var tableBody = document.getElementById("tableBody");
      var gridPositions = document.getElementById("gridPositions");
      tableBody.innerHTML = "";
      gridPositions.innerHTML = "";

      switch (filter)
      {
         case "all":
         case "Underwater Cave":
            addRows(underWaterCaves, "ucCol");
            addListeners();
            if (filter != "all") break;
         case "Cave":
            addRows(caves, "cCol");
            addListeners();
            if (filter != "all") break;
         case "Tribe":
            addRows(tribes, "tCol");
            addListeners();
            if (filter != "all") break;
         case "Enemy Tribe":
            addRows(enemyTribes, "etCol");
            addListeners();
            if (filter != "all") break;
         case "Point of Interest":
            addRows(pois, "pCol");
            addListeners();
            break;
         default:
      }

      function addRows(location, className)
      {
         Object.keys(location).forEach(function(key)
         {
            var type = location[key]["type"];
            var id = type.substring(0, 3) + key;

            var child = "" +
               "<tr>" +
               "<td>" + key + "</td>" +
               "<td class='" + className + "'>" + type + "</td>" +
               "<td>" + location[key]["name"] + "</td>" +
               "<td>" + location[key]["y"] + "</td>" +
               "<td>" + location[key]["x"] + "</td>" +
               "<td><a id='" + id + "' class='deleteButton' data-location='" +
               type +
               "' " +
               "data-id='" +
               key +
               "'>Delete</a></td>" +
               "</tr>";
            tableBody.innerHTML += child;

            var element = "" +
               "<div style='left:" +
               ((Math.round(((location[key]["x"] / 1.4285) * 10) * 10) / 10) - 3) +
               "px; top:" +
               ((Math.round(((location[key]["y"] / 1.4285) * 10) * 10) / 10) - 8) +
               "px;' class='location " + className + "'>" +
               "<span>" + key + "</span><br />" +
               "</div>";
            gridPositions.innerHTML += element;

         });
      }

      function addListeners()
      {
         var classname = document.getElementsByClassName("deleteButton");

         for(var i=0;i<classname.length;i++){
            classname[i].addEventListener('click', deleteRow, false);
         }
      }
   }

   function deleteRow()
   {
      var location = this.getAttribute("data-location");
      var id = this.getAttribute("data-id");
      var locations;

      switch (location)
      {
         case "Underwater Cave":
            locations = underWaterCaves;
            break;
         case "Cave":
            locations = caves;
            break;
         case "Tribe":
            locations = tribes;
            break;
         case "Enemy Tribe":
            locations = enemyTribes;
            break;
         case "Point of Interest":
            locations = pois;
            break;
         default:
      }
      locations.splice(id,1);
      refreshTable();
   }

   function move(evt)
   {
      var e = document.getElementById("coordinates");
      e.style.display = "block";
      e.style.left = evt.pageX + 10 + "px";
      e.style.top = evt.pageY + 10 + "px";

      e.innerHTML = "X: " + (Math.round(((evt.pageX * 1.4285) / 10) * 10) / 10) + " / Y: " + (Math.round(((evt.pageY * 1.4285) / 10) * 10) / 10);
   }

   function click(evt)
   {
      var x = document.getElementById("x");
      var y = document.getElementById("y");
      x.value = (Math.round(((evt.pageX * 1.4285) / 10) * 10) / 10).toString();
      y.value = (Math.round(((evt.pageY * 1.4285) / 10) * 10) / 10).toString();
      window.location.hash = '#type';
   }

   function hide(evt)
   {
      document.getElementById("coordinates").style.display = "none";
   }

   function addToLocationArray(type, name, x, y)
   {
      var locations = [];


      switch (type)
      {
         case "Underwater Cave":
            locations = underWaterCaves;
            break;
         case "Cave":
            locations = caves;
            break;
         case "Tribe":
            locations = tribes;
            break;
         case "Enemy Tribe":
            locations = enemyTribes;
            break;
         case "Point of Interest":
            locations = pois;
            break;
         default:
      }

      var location = [];

      location["type"] = type;
      location["name"] = name;
      location["x"] = x;
      location["y"] = y;

      locations.push(location);
   }

   function addToDatabase(evt)
   {
      var type = document.getElementById("type").value;
      var name = document.getElementById("name").value;
      var x = document.getElementById("x").value;
      var y = document.getElementById("y").value;


      addToLocationArray(type, name, x, y);
      refreshTable();
   }

   function confirmSave()
   {
      if(document.getElementById("server_name").value != "" ||
            document.getElementById("server_ip").value != "" ||
            underWaterCaves.length != 0 ||
            caves.length != 0 ||
            tribes.length != 0 ||
            enemyTribes.length != 0 ||
            pois.length != 0)
      {
         document.getElementById("saveConfirm").style.display = "block";
         document.getElementById("saveConfirmYes").setAttribute("data-process", this.id);
         document.getElementById("saveConfirmNo").setAttribute("data-process", this.id);
      }
      else if(this.id == "newMap")
      {
         newMap();
      }
      else if(this.id == "loadTemplate")
      {
         loadTemplate();
      }


   }

   function processConfirm()
   {


      if(this.id == "saveConfirmYes")
      {
         if(this.getAttribute("data-process") == "newMap")
         {
            saveAndClear();
         }
         else if(this.getAttribute("data-process") == "loadTemplate")
         {
            saveAndLoadTemplate();
         }
      }
      else
      {
         if(this.getAttribute("data-process") == "newMap")
         {
            newMap();
            //closeOverlay();
         }
         else if(this.getAttribute("data-process") == "loadTemplate")
         {
            console.log(this.getAttribute("data-process"));
            loadTemplate();
            //closeOverlay();
         }
      }

   }

   function closeOverlay()
   {
      document.getElementById("saveConfirm").style.display = "none";
   }

   function saveAndClear()
   {
      saveMap();
      newMap();
      closeOverlay();
   }

   function saveAndLoadTemplate()
   {
      saveMap();
      loadTemplate();
      closeOverlay();
   }

   function newMap()
   {
      underWaterCaves = [];
      caves = [];
      tribes = [];
      enemyTribes = [];
      pois = [];

      document.getElementById("server_name").value = "";
      document.getElementById("server_ip").value = "";
      refreshTable();
      closeOverlay();
      document.getElementById("filter").value = "all";
   }

   function loadMap(e)
   {
      var file = e.target.files[0]; // FileList object
      var xmlDoc = "";
      var text = "";

      var fr = new FileReader();
      fr.onload = function (e)
      {
         xmlDoc = loadXMLString(e.target.result.toString());

         processXML(xmlDoc);

         document.getElementById("fileForm").reset();
      };
      fr.readAsText(file);
   }

   function loadTemplate()
   {
      var xmlhttp;
      if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
         xmlhttp=new XMLHttpRequest();
      }
      else
      {// code for IE6, IE5
         xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange=function()
      {
         if (xmlhttp.readyState==4 && xmlhttp.status==200)
         {
            xmlDoc = loadXMLString(xmlhttp.responseText);
            processXML(xmlDoc);

         }
      };
      xmlhttp.open("GET","CaveLocations.ark",true);
      xmlhttp.send();
   }

   function processXML(xmlDoc)
   {
      document.getElementById("server_name").value = xmlDoc.getElementsByTagName("server")[0].getElementsByTagName("name")[0].innerHTML;
      document.getElementById("server_ip").value = xmlDoc.getElementsByTagName("server")[0].getElementsByTagName("ip")[0].innerHTML;


      var locationsXML = xmlDoc.getElementsByTagName("locations")[0].childNodes;

      underWaterCaves = [];
      caves = [];
      tribes = [];
      enemyTribes = [];
      pois = [];

      for (var key in locationsXML)
      {
         if (locationsXML[key].nodeName == "location")
         {
            var type = locationsXML[key].getElementsByTagName("type")[0].innerHTML;
            var name = locationsXML[key].getElementsByTagName("name")[0].innerHTML;
            var x = locationsXML[key].getElementsByTagName("x")[0].innerHTML;
            var y = locationsXML[key].getElementsByTagName("y")[0].innerHTML;

            addToLocationArray(type, name, x, y);
            refreshTable();
            closeOverlay();
            document.getElementById("filter").value = "all";
         }
      }
   }

   function loadXMLString(txt)
   {
      if (window.DOMParser)
      {
         var parser = new DOMParser();
         var xmlDoc = parser.parseFromString(txt, "text/xml");
      }
      else // code for IE
      {
         xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
         xmlDoc.async = false;
         xmlDoc.loadXML(txt);
      }
      return xmlDoc;
   }

   function saveMap()
   {
      var servername = document.getElementById("server_name").value != "" ? document.getElementById("server_name").value : "ArkMapData";
      download(buildXMLString(), servername + ".ark", "text/xml");

      return true;

      function download(text, name, type)
      {
         var a = document.createElement("a");
         var file = new Blob([text], {type: type});
         a.href = URL.createObjectURL(file);
         a.download = name;
         a.click();
      }

      function buildXMLString()
      {
         var output = "";

         output += "<data>" + "\n";
         output += "    <server>" + "\n";
         output += "       <name>" + document.getElementById("server_name").value + "</name>" + "\n";
         output += "       <ip>" + document.getElementById("server_ip").value + "</ip>" + "\n";
         output += "    </server>" + "\n";
         output += "    <locations>" + "\n";

         for (i = 0; i < 5; i++)
         {
            var locations = [];
            switch (i)
            {
               case 0:
                  locations = underWaterCaves;
                  break;
               case 1:
                  locations = caves;
                  break;
               case 2:
                  locations = tribes;
                  break;
               case 3:
                  locations = enemyTribes;
                  break;
               case 4:
                  locations = pois;
                  break;
               default:
            }

            for (var key in locations)
            {
               output += "       <location>" + "\n";
               output += "          <type>" + locations[key]["type"] + "</type>" + "\n";
               output += "          <name>" + locations[key]["name"] + "</name>" + "\n";
               output += "          <x>" + locations[key]["x"] + "</x>" + "\n";
               output += "          <y>" + locations[key]["y"] + "</y>" + "\n";
               output += "       </location>" + "\n";
            }
         }
         output += "    </locations>" + "\n";
         output += "</data>";

         return output;
      }
   }

}




