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

	buildPlane( width, height, depth_half, 4 ); // pz
	buildPlane( width, height, - depth_half, 5 ); // nz
 	// buildPlane( 'z', 'y', - 1, - 1, depth, height, width_half, 0 ); // px
 	// buildPlane( 'z', 'y',   1, - 1, depth, height, - width_half, 1 ); // nx
 	// buildPlane( 'x', 'z',   1,   1, width, depth, height_half, 2 ); // py
 	// buildPlane( 'x', 'z',   1, - 1, width, depth, - height_half, 3 ); // ny

	function buildPlane( width, height, depth, materialIndex ) {

		var ix, iy,
		gridX = scope.widthSegments,
		gridY = scope.heightSegments,
		width_half = width / 2,
		height_half = height / 2,
		offset = scope.vertices.length;

		var gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY,
		normal = new THREE.Vector3();

		normal.z = depth > 0 ? 1 : - 1;

		for ( iy = 0; iy < gridY1; iy ++ ) {

			for ( ix = 0; ix < gridX1; ix ++ ) {

				var vector = new THREE.Vector3();
				vector.x = ix * segment_width - width_half;
				vector.y = iy * segment_height - height_half;
				vector.z = depth;

				scope.vertices.push( vector );

			}

		}

		for ( iy = 0; iy < gridY; iy++ ) {

			for ( ix = 0; ix < gridX; ix++ ) {

                if (jigsaw[gridY-1-iy][ix]===' ')
                  continue;

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				var uva = new THREE.Vector2( ix / gridX, 1 - iy / gridY );
				var uvb = new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY );
				var uvc = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - ( iy + 1 ) / gridY );
				var uvd = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY );

                if (depth > 0) {
                  var t = b; b = d; d = t;
                  var uvt = uvb; uvb = uvd; uvd = uvt;
                }

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
