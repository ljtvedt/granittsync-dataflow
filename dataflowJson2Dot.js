'use strict';

//https://stackoverflow.com/questions/22727974/automatic-visualization-of-json

var _ = require('lodash');
var data = require('./GranittSyncDataFlow.json');

var nodeTypeAttributes = {"table": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="azure3"',
						  "synonym": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="gold"',
						  "view": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="darkviolet"',
						  "materialized view": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="cyan"'};

var nodeCounter = 1;
var edges = [];
var nodes = {};


function handleNode (obj) {
	var myId = nodeCounter++;
	nodes[obj.schema.toUpperCase() + '.' + obj.name.toUpperCase()] = {id: myId, schema: obj.schema, name: obj.name, type: obj.type}
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

function capitalizeFirst(s) {
	return s.trim().charAt(0).toUpperCase() + s.trim().slice(1);
}

function attrToolTip(node) {
	return `tooltip="${capitalizeFirst(node.type)} ${node.schema}.${node.name}"` 
}

function attrLabel(node) {
	return `label="${node.name}"` 
}

function nodeAttributes(node) {
	return `[${attrLabel(node)}, ${attrToolTip(node)}, ${nodeTypeAttributes[node.type]}];`
}

handleNodeArray(data);

console.log('digraph g {');
console.log('graph [rankdir = "LR"];');
//console.log('graph [rankdir = "LR", nodesep=0.1, ranksep=0.3];');
//console.log('node [fontsize = "16", shape = "record", height=0.1, color=lightblue2];');
//console.log('node [];');
console.log('edge [];');

// Write a cluster for each "schema"
var cluster = _.groupBy(nodes, function (n) { return n.schema; });
var cluster_iterator = 0;
_.map(Object.keys(cluster), function (k) {
		console.log(`subgraph cluster_${cluster_iterator++} { label = "${k}";`)
		_.map(cluster[k], function (n) { console.log(n.id + nodeAttributes(n));});
		console.log("}")
	});

_.map(edges, function (e) {
	if (nodes[e.from.toUpperCase()] != undefined) {
		console.log(nodes[e.from.toUpperCase()].id + '->' + e.to + ';');
	} else {
		throw "Unable to identify node with name " + e.from;
	}
});

console.log('}');