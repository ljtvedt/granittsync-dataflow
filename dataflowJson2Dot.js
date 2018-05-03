'use strict';

//https://stackoverflow.com/questions/22727974/automatic-visualization-of-json

var _ = require('lodash');
var data = require('./GranittSyncDataFlow.json');

var nodeCounter = 1;

function formatEllipsizedText(text, maxLength) {
    if (text.length > maxLength - 1) {
        return text.substring(0, maxLength - 1) + '…';
    } else {
        return text;
    }
}

function json2gvLabel(obj) {
    return _.map(_.keys(obj), function (key) { return '<' + key + '> ' + key; }).join('|');
}

function name2id(name) {
	return name.replace(".", "#");
}

var edges = [];
var nodes = {};

function handleNode (obj) {
	var myId = nodeCounter++;
	nodes[obj.name] = {id: myId, name: obj.name, label: obj.name}
	if ('from' in obj) {
		if (_.isArray(obj.from)) {
		    _.map(obj.from, function(n) {
				edges.push({from: n, to: myId})
			});
		} else {
			edges.push({from: obj.from, to: myId})
		}
	}
}

function handleNodeArray(array) {
    _.each(array, function(value) {
		handleNode(value);
	})	
}

function recurse(parentNode, obj) {
    var myId = nodeCounter++;
    edges.push({from: parentNode, to: myId});
    if (_.isArray(obj)) {
        nodes.push({id: myId, label: 'array'});
        recurse(myId, obj[0]);
    } else if (!_.isObject(obj)) {
        nodes.push({id: myId, label: formatEllipsizedText('' + obj, 50)});
    } else {
        nodes.push({id: myId, label: json2gvLabel(obj)});
        _.each(obj, function (v, k) {
            recurse(myId + ':' + k, v);
        });
    }
}

//recurse('root', datak);
handleNodeArray(data);

console.log('digraph g {');
console.log('graph [rankdir = "LR", nodesep=0.1, ranksep=0.3];');
console.log('node [fontsize = "16", shape = "record", height=0.1, color=lightblue2];');
console.log('edge [];');

_.map(nodes, function (n) {
    console.log(n.id + '[label="' + n.label + '"];');
});
_.map(edges, function (e) {
    console.log(nodes[e.from].id + '->' + e.to + ';');
});

console.log('}');