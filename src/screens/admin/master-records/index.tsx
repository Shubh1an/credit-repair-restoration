import React, { useState } from 'react';
import { ModalComponent } from '../../../shared/components/modal';

import { DashboardWidget } from '../../dashboard/components/dashboard-widget';
import { CreateServiceItemComponent } from './outsourced-services/';
import { ServiceMappingComponent } from './outsourced-services/service-mapping';

import './master-data.scss';
import { CollectionEntryTypes } from '../../../models/enums';

const MasterDataComponent = (props: any) => {

  const [isLoading, setIsLoading] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openmappingModel, setOpenmappingModel] = useState(false);
  const [dataType, setDataType] = useState(null as CollectionEntryTypes | null);

  const onListReload = () => { }
  const onSave = () => { }
  const onSaveMapping = () => { }

  return (
    <div className='customers-list lead-list'>
      <section className='content-header'>
        <div className='header-icon'>
          <i className='fa fa-database'></i>
        </div>
        <div className='header-title'>
          <h1>Master Records</h1>
          <small>Add, Edit and delete Master Data</small>
        </div>
      </section>
      <section className='content'>
        <DashboardWidget title={"Services"}
          reloadHandler={onListReload} isLoading={isLoading} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
          <div className='steps-services p-5'>
            <div className='step btn btn-primary p-3 rounded font-weight-bold pl-5 pr-5' onClick={() => { setOpenModel(true); setDataType(CollectionEntryTypes.Service) }}>
              Services
              <i className='fa fa-chevron-right ml-2'></i>
            </div>
            <div className='step btn btn-primary p-3 rounded font-weight-bold' onClick={() => { setOpenModel(true); setDataType(CollectionEntryTypes.ServiceLevel) }}>
              Service Levels
              <i className='fa fa-chevron-right ml-2'></i>
            </div>
            <div className='step btn btn-primary p-3 rounded font-weight-bold' onClick={() => { setOpenModel(true); setDataType(CollectionEntryTypes.ServiceOption) }}>
              Service Options
              <i className='fa fa-chevron-right ml-2'></i>
            </div>
            <div className='step btn btn-success p-3 rounded font-weight-bold' onClick={() => { setOpenmappingModel(true); }}>
              Service Pricings
              <i className='fa fa-chevron-right ml-2'></i>
            </div>
          </div>
        </DashboardWidget>
      </section>
      <ModalComponent title={'Create Master Data'} halfFullScreen={true} isVisible={openModel} onClose={() => setOpenModel(false)}>
        {openModel && <CreateServiceItemComponent type={dataType} onSuccess={onSave} />}
      </ModalComponent>
      <ModalComponent title={'Create Service Mapping'} fullscreen={true} fullscreen100W={true} isVisible={openmappingModel} onClose={() => setOpenmappingModel(false)}>
        {openmappingModel && <ServiceMappingComponent onSuccess={onSaveMapping} />}
      </ModalComponent>
    </div>
  );
};

export default MasterDataComponent;
