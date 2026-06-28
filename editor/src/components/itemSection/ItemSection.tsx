import { useState } from 'react';
import type { Location, Item } from '@type/Location';
import { useEditorStore } from '../../utils/useEditorStore';
import { Field, Toggle } from '../ui/Field';
import { ReadOnlyId } from '../ui/ReadOnlyId';
import { slugify, uniqueId } from '../../utils/idUtils';
import style from './ItemSection.module.css';

interface Props {
    location: Location;
}

export const ItemSection = ({ location }: Props) => {
    const { addItem, updateItem, deleteItem } = useEditorStore();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggle = (id: string) =>
        setExpandedId((prev) => (prev === id ? null : id));

    const handleIdChange = (oldId: string, newId: string) => {
        if (expandedId === oldId) setExpandedId(newId);
    };

    return (
        <section className={style.section}>
            <div className={style.header}>
                <span>Items ({location.items.length})</span>
                <button
                    className={style.addBtn}
                    onClick={() => addItem(location.id)}
                >
                    + Add item
                </button>
            </div>
            {location.items.map((item) => (
                <div key={item.id} className={style.item}>
                    <div className={style.row} onClick={() => toggle(item.id)}>
                        <span className={style.arrow}>
                            {expandedId === item.id ? '▾' : '▸'}
                        </span>
                        <span className={style.itemName}>
                            {item.name || <em>unnamed</em>}
                        </span>
                        <span className={style.itemId}>{item.id}</span>
                        <button
                            className={style.deleteBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(location.id, item.id);
                            }}
                        >
                            ×
                        </button>
                    </div>
                    {expandedId === item.id && (
                        <ItemForm
                            locationId={location.id}
                            item={item}
                            siblingIds={location.items.filter((i) => i.id !== item.id).map((i) => i.id)}
                            onUpdate={updateItem}
                            onIdChange={handleIdChange}
                        />
                    )}
                </div>
            ))}
        </section>
    );
};

interface FormProps {
    locationId: string;
    item: Item;
    siblingIds: string[];
    onUpdate: (locationId: string, itemId: string, patch: Partial<Item>) => void;
    onIdChange: (oldId: string, newId: string) => void;
}

const ItemForm = ({ locationId, item, siblingIds, onUpdate, onIdChange }: FormProps) => {
    const up = (patch: Partial<Item>) => onUpdate(locationId, item.id, patch);

    const handleNameBlur = (name: string) => {
        const derived = uniqueId(slugify(name), siblingIds);
        if (derived !== item.id) {
            onIdChange(item.id, derived);
            up({ id: derived });
        }
    };

    return (
        <div className={style.form}>
            <div className={style.formRow}>
                <Field
                    label='Name'
                    value={item.name}
                    onChange={(name) => up({ name })}
                    onBlur={handleNameBlur}
                />
                <ReadOnlyId id={item.id} />
            </div>
            <Field
                label='Description'
                value={item.description}
                onChange={(description) => up({ description })}
                multiline
            />
            <div className={style.toggleRow}>
                <Toggle
                    label='Interactive'
                    value={item.interactive}
                    onChange={(interactive) => up({ interactive })}
                />
                <Toggle
                    label='Can pick up'
                    value={item.canPickup}
                    onChange={(canPickup) => up({ canPickup })}
                />
            </div>
        </div>
    );
};
