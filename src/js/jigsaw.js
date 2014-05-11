/**
 * jigsaw is an array of equal-length strings, e.g.
 * [ " xxx ",
     "xxxx ",
     " xxxx",
     "xxxx ",
     "  x  " ]
 */

THREE.JigsawGeometry = function ( width, height, depth, widthSegments, heightSegments, jigsaw ) {

	THREE.Geometry.call( this );

	this.parameters = {
		width: width,
		height: height,
		depth: depth,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		jigsaw: jigsaw
	};

	this.heightSegments = heightSegments || jigsaw.length;
	this.widthSegments = widthSegments || jigsaw[0].length;

    // TODO: check jigsaw string lengths

	var scope = this;

	var width_half = width / 2;
	var height_half = height / 2;
	var depth_half = depth / 2;

	buildPlane( 'x', 'y',   1,  -1, width, height, depth_half, 0 ); // pz
	buildPlane( 'x', 'y',   1,   1, width, height, - depth_half, 0 ); // nz
 	// buildPlane( 'z', 'y', - 1, - 1, depth, height, width_half, 0 ); // px
 	// buildPlane( 'z', 'y',   1, - 1, depth, height, - width_half, 1 ); // nx
 	// buildPlane( 'x', 'z',   1,   1, width, depth, height_half, 2 ); // py
 	// buildPlane( 'x', 'z',   1, - 1, width, depth, - height_half, 3 ); // ny

	function buildPlane( u, v, udir, vdir, width, height, depth, materialIndex ) {

		var w, ix, iy,
		gridX = scope.widthSegments,
		gridY = scope.heightSegments,
		width_half = width / 2,
		height_half = height / 2,
		offset = scope.vertices.length;

	    w = 'z';

		var gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY,
		normal = new THREE.Vector3();

		normal[ w ] = depth > 0 ? 1 : - 1;

		for ( iy = 0; iy < gridY1; iy ++ ) {

			for ( ix = 0; ix < gridX1; ix ++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( vector );

			}

		}

		for ( iy = 0; iy < gridY; iy++ ) {

			for ( ix = 0; ix < gridX; ix++ ) {

                if (jigsaw[vdir > 0 ? iy : gridY-iy-1][ix]===' ')
                  continue;

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				var uva = new THREE.Vector2( ix / gridX, 1 - iy / gridY );
				var uvb = new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY );
				var uvc = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - ( iy + 1 ) / gridY );
				var uvd = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY );

				var face = new THREE.Face3( a + offset, b + offset, d + offset );
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
				face.materialIndex = materialIndex;

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

				face = new THREE.Face3( b + offset, c + offset, d + offset );
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
				face.materialIndex = materialIndex;

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

			}

		}

	}

	this.mergeVertices();

};

THREE.JigsawGeometry.prototype = Object.create( THREE.Geometry.prototype );
