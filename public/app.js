function loadPage() {
	$('body').load('/home.html');
}

function characters() {
	$('body').load('/characters.html');
}

function monsters() {
	$('body').load('/monsters.html');
}

function editCharacter(index) {
	var editSelect = "#id-" + index;
	var charId = $(editSelect).val();
	$('body').load('/editCharacter.html', {'charId': charId});
}

function deleteCharacter(index) {
	var deleteSelect = "#id-" + index;
	var charId = $(deleteSelect).val();
	$('body').load('/deleteCharacter.html', {'charId': charId});
}

function saveCharacter() {
	character = {};
	character.id = $('#charId').val();
	character.name = $('#name').val();
	character.hp = $('#hp').val();
	character.ac = $('#ac').val();
	character.speed = $('#speed').val();
	character.str = $('#str').val();
	character.dex = $('#dex').val();
	character.con = $('#con').val();
	character.int = $('#int').val();
	character.wis = $('#wis').val();
	character.char = $('#char').val();
	character.class = $('#class').val();
	character.race = $('#race').val();
	character.proficiency = $('#proficiency').val();
	character.description = $('#description').val();
	//character.image = $('#image').val();
	$('body').load('/saveCharacter', character);
}

function addToEncounter() {
	var charCount = $('#char-count').val();
	var selectedId = $('#addCharacter').val();
	var selectedCharacter = $('#addCharacter option:selected').attr('id');
	var trString = '<tr id="row-' + charCount + '"><td>' + selectedCharacter + '</td><td><input class="init-num" type="number" id="' + selectedId + '" required></td><td><button class="btn btn-danger" onclick="removeFromInit(' + charCount + ')">X</button></td></tr>';
	$('#char-count').val(Number($('#char-count').val()) + 1);
	if (($('#char-count').val()) > 1) {
		$('#start-button').attr('disabled', false);
	}
	$('#character-table tr:last').after(trString);
}

function removeFromInit(charCount) {
	var selectString = '#row-' + charCount;
	$(selectString).remove();
	$('#char-count').val(Number($('#char-count').val()) - 1);
	if (($('#char-count').val()) < 2) {
		$('#start-button').attr('disabled', true);
	}
}

function goToEncounter() {
	$('body').load('/encounter.html');
}

function goToBattle() {
	$('body').load('/battle.html');
}

function subHp(index) {
	var subSelect = "#hpAddSub-" + index;
	var sub = $(subSelect).val();
	var curSelect = "#hp-" + index;
	var curHp =  $(curSelect).val();
	var newHp = Number(curHp) - Number(sub);
	if(newHp < 0 ) {
		newHp = 0;
	}
	var replaceText = "Hit Points: " + newHp;
	var replaceBtn = '#hpBtn-' + index; 
	$(curSelect).val(newHp);
	$(replaceBtn).html(replaceText);
}

function addHp(index) {
	var addSelect = "#hpAddSub-" + index;
	var add = $(addSelect).val();
	var curSelect = "#hp-" + index;
	var curHp =  $(curSelect).val();
	var newHp = Number(curHp) + Number(add);
	var maxSelect = "#max-hp-" + index;
	var maxHp = $(maxSelect).val();
	if(newHp > Number(maxHp) ) {
		newHp = Number(maxHp);
	}
	var replaceText = "Hit Points: " + newHp;
	var replaceBtn = '#hpBtn-' + index; 
	$(curSelect).val(newHp);
	$(replaceBtn).html(replaceText);
}

function startBattle() {
	var tempDict = {};
	var inits = [];
	var index = 0;
	$('#character-table tr input').each(function() {
		inits[index] = this.value;
		tempDict[index] = {'init': this.value, 'id': this.id};
		index++;
	});
	inits.sort(function(a, b) {
		return b-a
	});
	var initOrder = [];
	inits.forEach(function(init) {
		for(arrayNum in tempDict) {
			if(tempDict[arrayNum].init == init) {
				initOrder.push({'id': tempDict[arrayNum].id});
			}
		}
	});
	console.log(initOrder);
	var context = {};
	context.initOrder = initOrder;
	$('body').load('/startBattle', context);
}

function roll(num) {
	var retString = '#d' + num;
	$(retString).val((Math.floor(Math.random()*num)) + 1);
}

loadPage();