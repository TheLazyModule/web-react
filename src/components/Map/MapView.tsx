import {LayersControl, MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Sidebar from '../Sidebar/Sidebar.tsx';

const MapView = () => {
    const {BaseLayer} = LayersControl;
    return (
        <div className="relative">

            <Sidebar position="left" theme="light"/>

            <MapContainer center={[6.673175, -1.565423]} zoom={15} style={{height: "100vh", width: "100%"}}>
                <LayersControl>
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </BaseLayer>

                    <BaseLayer name="Satellite View">
                        <TileLayer
                            url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                            maxZoom={20}
                            subdomains={['mt1', 'mt2', 'mt3']}
                        />
                    </BaseLayer>
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export default MapView;
