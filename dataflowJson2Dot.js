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

/*
function json2gvLabel(obj) {
    return _.map(_.keys(obj), function (key) { return '<' + key + '> ' + key; }).join('|');
}
*/

var nodeTypeAttributes = {"table": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="azure3"',
						  "synonym": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="gold"',
						  "view": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="darkviolet"',
						  "materialized view": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="blue"'};

var edges = [];
var nodes = {};

function handleNode (obj) {
	var myId = nodeCounter++;
	nodes[obj.name.toUpperCase()] = {id: myId, name: obj.name, label: obj.name, type: obj.type}
	if ('from' in obj) {
		if (_.isArray(obj.from)) {
		    _.map(obj.from, function(n) {
				edges.push({from: n.toUpperCase(), to: myId})
			});
		} else {
			edges.push({from: obj.from.toUpperCase(), to: myId})
		}
	}
}

function handleNodeArray(array) {
    _.each(array, function(value) {
		handleNode(value);
	})	
}

function nodeAttributes(node) {
	return '[label="' + node.label + '" ' + nodeTypeAttributes[node.type] + '];'
}

/*
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
*/

//recurse('root', datak);
handleNodeArray(data);

console.log('digraph g {');
console.log('graph [rankdir = "LR", nodesep=0.1, ranksep=0.3];');
//console.log('node [fontsize = "16", shape = "record", height=0.1, color=lightblue2];');
//console.log('node [];');
console.log('edge [];');

_.map(nodes, function (n) {
    console.log(n.id + nodeAttributes(n));
});
_.map(edges, function (e) {
	if (nodes[e.from.toUpperCase()] != undefined) {
		console.log(nodes[e.from.toUpperCase()].id + '->' + e.to + ';');
	} else {
		throw "Unable to identify node with name " + e.from;
	}
});

console.log('}');