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

    this.jigsaw = jigsaw;

    // TODO: check jigsaw string lengths

	var scope = this;

	var width_half = width / 2;
	var height_half = height / 2;
	var depth_half = depth / 2;

	buildPlane( width, height, depth_half, 4 ); // pz
	buildPlane( width, height, - depth_half, 5 ); // nz
 	buildSide( 'y', 'x',   1, - 1, this.heightSegments, this.widthSegments,  0 ); // px
 	buildSide( 'y', 'x', - 1,   1, this.heightSegments, this.widthSegments,  1 ); // nx
 	buildSide( 'x', 'y', - 1, - 1, this.widthSegments,  this.heightSegments, 2 ); // py
 	buildSide( 'x', 'y',   1,   1, this.widthSegments,  this.heightSegments, 3 ); // ny

    function buildSide( u, v, udir, vdir, gridU, gridV, materialIndex ) {

		var normal = new THREE.Vector3();
		normal[v] = vdir;

        var iu,iv,pos={ },off= { };
        off[u] = udir > 0 ? 0 : -1;
        off[v] = vdir > 0 ? 0 : -1;
        for(iu=0;iu<gridU;++iu) {
            pos[u]= udir > 0 ? iu : gridU-iu;
            var onBlank = true;
            for(iv=0;iv<gridV;++iv) {
                pos[v]= vdir > 0 ? iv : gridV-iv;
                if (onBlank && jigsaw[scope.heightSegments-1-pos.y-off.y][pos.x+off.x]!==' ') {
                    // change from blank to filled. Add surface.
                    var a = verticeIndex(pos.x,pos.y,false),
                        b = verticeIndex(pos.x,pos.y,true);
                    pos[u] += udir;
                    var c = verticeIndex(pos.x,pos.y,true),
                        d = verticeIndex(pos.x,pos.y,false);
                    pos[u] -= udir;

                    var uva = new THREE.Vector2( iu / gridU, 1 );
                    var uvb = new THREE.Vector2( iu / gridU, 0 );
                    var uvc = new THREE.Vector2( ( iu + 1 ) / gridU, 0 );
                    var uvd = new THREE.Vector2( ( iu + 1 ) / gridU, 1 );

                    makeSquare(a,b,c,d,uva,uvb,uvc,uvd,normal,materialIndex);

                    onBlank = false;
                } else if (!onBlank && jigsaw[scope.heightSegments-1-pos.y-off.y][pos.x+off.x]===' ') {
                    onBlank = true;
                }
            }
        }
    }

    function verticeIndex(ix,iy,isNZ) {
        return iy*(scope.widthSegments+1) + ix + (isNZ ? (scope.widthSegments+1)*(scope.heightSegments+1) : 0);
    }

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

                makeSquare(a+offset,b+offset,c+offset,d+offset,uva,uvb,uvc,uvd,normal,materialIndex);

			}

		}

	}

    function makeSquare(a,b,c,d,uva,uvb,uvc,uvd,normal,materialIndex) {
        var face = new THREE.Face3( a, b, d );
        face.normal.copy( normal );
        face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
        face.materialIndex = materialIndex;

        scope.faces.push( face );
        scope.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

        face = new THREE.Face3( b, c, d );
        face.normal.copy( normal );
        face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );
        face.materialIndex = materialIndex;

        scope.faces.push( face );
        scope.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );
    }

	this.mergeVertices();

};

THREE.JigsawGeometry.prototype = Object.create( THREE.Geometry.prototype );
