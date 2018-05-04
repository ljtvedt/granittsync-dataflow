'use strict';

var _ = require('lodash');
var data = require('./GranittSyncDataFlow.json');

var nodeTypeAttributes = {"table": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="azure3"',
						  "synonym": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="gold"',
						  "view": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="darkviolet"',
						  "materialized view": 'fontsize = "16", shape = "record", height=0.1, style="filled", color=lightblue2, fillcolor="cyan"'};

var nodeCounter = 1;
var edges = [];
var nodes = {};

function nodeUniqueName(node) {
	return (node.schema + '.' + node.name).toUpperCase()
}

function edge(s, t) {
	if (_.isObject(s)) {
		return {from: s.name.toUpperCase(), to: nodeUniqueName(t), by: s.by}
	}
	else {
		return{from: s.toUpperCase(), to: nodeUniqueName(t)}
	}
}

function handleNode (obj) {
var node = {id: nodeCounter++, schema: obj.schema, name: obj.name, type: obj.type};
	
	nodes[nodeUniqueName(node)] = node;
	if ('from' in obj) {
		if (_.isArray(obj.from)) {
		    _.map(obj.from, function(n) {
				edges.push(edge(n, node));
			});
		} else {
			edges.push(edge(obj.from, node))
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

function attrURL(node) {
	return `href="https://confluence.nrk.no/display/ODA/${node.name.toUpperCase()}" target="_graphviz"` 
}

function nodeAttributes(node) {
	return `[${attrLabel(node)}, ${attrToolTip(node)}, ${attrURL(node)}, ${nodeTypeAttributes[node.type]}];`
}

function edgeStmt(from, to, by) {
	var stmt = `${nodes[from].id}->${nodes[to].id}`
	var tooltip = "";
	var color = "";
	var label = "";
	
	if (by != undefined) {
		color = `color="red"`
		label = `label="${by}"`;
		tooltip = `tooltip="From: ${nodes[from].name}&#013;&#010;To: ${nodes[to].name}&#013;&#010;By: ${by}"`
	} else {
		color = `color="black"`
		label = `label=""`;
		tooltip = `tooltip="From: ${nodes[from].name}&#013;&#010;To: ${nodes[to].name}"`
	}
	return `${stmt} [${label}, ${tooltip}, ${color}];`
}

handleNodeArray(data);

console.log('digraph GranittSyncDataFlow {');
console.log('graph [rankdir = "LR"];');
console.log('node [];');
console.log('edge [];');

// Write a cluster for each "schema"
var cluster = _.groupBy(nodes, function (n) { return n.schema; });
var cluster_iterator = 0;
_.map(Object.keys(cluster), function (k) {
		console.log(`subgraph cluster_${cluster_iterator++} { label = "${k}";`) // Write a cluster for each schema
		_.map(cluster[k], function (n) { console.log(n.id + nodeAttributes(n));}); // Write all nodes in cluster
		console.log("}")
	});

_.map(edges, function (e) {
	if (nodes[e.from.toUpperCase()] != undefined) {
		console.log(edgeStmt(e.from, e.to, e.by));
	} else {
		throw "Unable to identify node with name " + e.from;
	}
});

console.log('}');